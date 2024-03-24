import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { ShippingAddressRepository } from '@/domain/customer/application/repositories/shipping-address-repository'
import { PackageShippingAddressRepository } from '@/domain/customer/application/repositories/package-shipping-address-repository'
import { PrismaPackageShippingAddressMapper } from '../mappers/prisma-package-shipping-address-mapper'
import { PackageShippingAddress } from '@/domain/customer/enterprise/entities/package-shipping-address'

@Injectable()
export class PrismaPackageShippingAddressRepository
  implements PackageShippingAddressRepository
{
  constructor(
    private prisma: PrismaService,
    private shippingAddressRepository: ShippingAddressRepository,
  ) {}

  async findById(
    shippingAddressId: string,
  ): Promise<PackageShippingAddress | null> {
    const shippingAddress = await this.prisma.packageShippingAddress.findUnique(
      {
        where: {
          id: shippingAddressId,
        },
      },
    )

    if (!shippingAddress) {
      return null
    }

    return PrismaPackageShippingAddressMapper.toDomain(shippingAddress)
  }

  async create(shippingAddressId: string): Promise<void> {
    const shippingAddress =
      await this.shippingAddressRepository.findById(shippingAddressId)

    if (!shippingAddress) {
      throw new Error('Shipping address not found')
    }

    const data = PrismaPackageShippingAddressMapper.toPrisma(shippingAddress)

    await this.prisma.packageShippingAddress.create({
      data,
    })
  }

  async delete(shippingAddressId: string): Promise<void> {
    await this.prisma.packageShippingAddress.delete({
      where: {
        id: shippingAddressId,
      },
    })
  }
}
