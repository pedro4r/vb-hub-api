import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PackageRepository } from '@/domain/customer/application/repositories/package-repository'
import { Package } from '@/domain/customer/enterprise/entities/package'
import { PrismaPackageMapper } from '../mappers/prisma-package-mapper'
import { PackageShippingAddressRepository } from '@/domain/customer/application/repositories/package-shipping-address-repository'
import { PackagePreview } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/package-preview'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { PackageDetails } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/package-details'

@Injectable()
export class PrismaPackageRepository implements PackageRepository {
  constructor(
    private prisma: PrismaService,
    private packageShippingAddressRepository: PackageShippingAddressRepository,
  ) {}

  async findDetailsById(id: string): Promise<PackageDetails | null> {}

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

  async findManyRecentByParcelForwardingId(
    parcelForwardingId: string,
    page: number,
  ) {
    const packages = await this.prisma.package.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        parcelForwardingId,
      },
      take: 20,
      skip: (page - 1) * 20,
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
          trackingNumber: packageDomain.trackingNumber,
          createdAt: packageDomain.createdAt,
          updatedAt: packageDomain.updatedAt,
        })
      }),
    )

    return packagesPreviews
  }
}
