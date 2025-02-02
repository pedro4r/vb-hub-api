import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PackageRepository } from '@/domain/customer/application/repositories/package-repository'
import {
  Package,
  PackageStatus,
} from '@/domain/customer/enterprise/entities/package'
import { PrismaPackageMapper } from '../mappers/prisma-package-mapper'
import { PackageShippingAddressRepository } from '@/domain/customer/application/repositories/package-shipping-address-repository'
import { PackagePreview } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/package-preview'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { PackageDetails } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/package-details'
import { FilteredPackagesData } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/filtered-packages'

@Injectable()
export class PrismaPackageRepository implements PackageRepository {
  constructor(
    private prisma: PrismaService,
    private packageShippingAddressRepository: PackageShippingAddressRepository,
  ) {}

  async findDetailsById(id: string): Promise<PackageDetails | null> {
    const pkg = await this.prisma.package.findUnique({
      where: {
        id,
      },
    })

    if (!pkg) {
      return null
    }

    const shippingAddress =
      await this.packageShippingAddressRepository.findById(
        pkg.packageShippingAddressId.toString(),
      )

    if (!shippingAddress) {
      throw new ResourceNotFoundError(
        `Shipping address with ID "${pkg.packageShippingAddressId.toString()}" does not exist.`,
      )
    }

    const customer = await this.prisma.customer.findUnique({
      where: {
        id: pkg.customerId.toString(),
      },
    })

    if (!customer) {
      throw new ResourceNotFoundError(
        `Customer with ID "${pkg.customerId.toString()}" does not exist.`,
      )
    }

    const packageToDomain = PrismaPackageMapper.toDomain(pkg)

    return PackageDetails.create({
      packageId: packageToDomain.id,
      parcelForwardingId: packageToDomain.parcelForwardingId,
      customerId: packageToDomain.customerId,
      hubId: customer.hubId,
      customerFirstName: customer.firstName,
      customerLastName: customer.lastName,
      packageShippingAddress: shippingAddress,
      hasBattery: packageToDomain.hasBattery,
      weight: packageToDomain.weight,
      trackingNumber: packageToDomain.trackingNumber,
      createdAt: packageToDomain.createdAt,
      updatedAt: packageToDomain.updatedAt,
    })
  }

  async create(pkg: Package): Promise<void> {
    await this.packageShippingAddressRepository.create(
      pkg.shippingAddressId.toString(),
    )
    const data = PrismaPackageMapper.toPrisma(pkg)
    await this.prisma.package.create({
      data,
    })
  }

  async findById(id: string): Promise<Package | null> {
    const pkg = await this.prisma.package.findUnique({
      where: {
        id,
      },
    })

    if (!pkg) {
      return null
    }

    return PrismaPackageMapper.toDomain(pkg)
  }

  async save(pkg: Package): Promise<void> {
    const data = PrismaPackageMapper.toPrisma(pkg)

    await this.prisma.package.update({
      where: {
        id: pkg.id.toString(),
      },
      data,
    })
  }

  async delete(pkg: Package): Promise<void> {
    const data = PrismaPackageMapper.toPrisma(pkg)

    await this.prisma.package.delete({
      where: {
        id: data.id,
      },
    })
  }

  async findManyByCustomerId(id: string): Promise<Package[]> {
    const packages = await this.prisma.package.findMany({
      where: {
        customerId: id,
      },
    })

    return packages.map((pkg) => PrismaPackageMapper.toDomain(pkg))
  }

  async findManyByFilter(
    parcelForwardingId,
    page,
    customersId,
    packageStatus,
    startDate,
    endDate,
  ) {
    const totalPackages = await this.prisma.package.count({
      where: {
        parcelForwardingId,
        customerId: customersId?.length
          ? {
              in: customersId,
            }
          : undefined,
        status: packageStatus ?? undefined,
        createdAt:
          startDate || endDate
            ? {
                ...(startDate ? { gte: startDate } : {}),
                ...(endDate ? { lte: endDate } : {}),
              }
            : undefined,
      },
    })

    const packages = await this.prisma.package.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        parcelForwardingId,
        customerId: customersId?.length
          ? {
              in: customersId,
            }
          : undefined,
        status: packageStatus ?? undefined, // Inclui apenas se definido
        createdAt:
          startDate || endDate
            ? {
                ...(startDate ? { gte: startDate } : {}),
                ...(endDate ? { lte: endDate } : {}),
              }
            : undefined,
      },
      take: 8,
      skip: (page - 1) * 8,
    })

    const packagesPreviews = await Promise.all(
      packages.map(async (pkg) => {
        const customer = await this.prisma.customer.findUnique({
          where: {
            id: pkg.customerId.toString(),
          },
        })

        if (!customer) {
          throw new ResourceNotFoundError(
            `Customer with ID "${pkg.customerId.toString()}" does not exist.`,
          )
        }

        const packageDomain = PrismaPackageMapper.toDomain(pkg)

        return PackagePreview.create({
          packageId: packageDomain.id,
          parcelForwardingId: packageDomain.parcelForwardingId,
          customerId: packageDomain.customerId,
          hubId: customer.hubId,
          customerFirstName: customer.firstName,
          customerLastName: customer.lastName,
          hasBattery: packageDomain.hasBattery,
          weight: packageDomain.weight,
          packageStatus: PackageStatus[packageDomain.status],
          trackingNumber: packageDomain.trackingNumber,
          createdAt: packageDomain.createdAt,
          updatedAt: packageDomain.updatedAt,
        })
      }),
    )

    return FilteredPackagesData.create({
      packages: packagesPreviews,
      meta: {
        pageIndex: page,
        perPage: 8,
        totalCount: totalPackages,
      },
    })
  }
}
