import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PackageRepository } from '@/domain/customer/application/repositories/package-repository'
import { Package } from '@/domain/customer/enterprise/entities/package'
import { PrismaPackageMapper } from '../mappers/prisma-package-mapper'
import { PackageShippingAddressRepository } from '@/domain/customer/application/repositories/package-shipping-address-repository'

@Injectable()
export class PrismaPackageRepository implements PackageRepository {
  constructor(
    private prisma: PrismaService,
    private packageShippingAddressRepository: PackageShippingAddressRepository,
  ) {}

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

  async findManyByCustomerId(id: string): Promise<Package[] | null> {
    const packages = await this.prisma.package.findMany({
      where: {
        customerId: id,
      },
    })

    if (!packages) {
      return null
    }

    return packages.map((pkg) => PrismaPackageMapper.toDomain(pkg))
  }
}
