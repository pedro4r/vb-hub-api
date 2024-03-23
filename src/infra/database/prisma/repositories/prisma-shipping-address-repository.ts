import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { ShippingAddressRepository } from '@/domain/customer/application/repositories/shipping-address-repository'
import { ShippingAddress } from '@/domain/customer/enterprise/entities/shipping-address'
import { PrismaShippingAddressMapper } from '../mappers/prisma-shipping-address-mapper'

@Injectable()
export class PrismaShippingAddressRepository
  implements ShippingAddressRepository
{
  constructor(private prisma: PrismaService) {}
  async findManyByCustomerId(customerId: string) {
    const shippingAddresses = await this.prisma.shippingAddress.findMany({
      where: {
        customerId,
      },
    })

    if (!shippingAddresses) {
      return null
    }

    return shippingAddresses.map(PrismaShippingAddressMapper.toDomain)
  }

  async findById(shippingAddressId: string) {
    const shippingAddress = await this.prisma.shippingAddress.findUnique({
      where: {
        id: shippingAddressId,
      },
    })

    if (!shippingAddress) {
      return null
    }

    return PrismaShippingAddressMapper.toDomain(shippingAddress)
  }

  async create(shippingAddress: ShippingAddress) {
    const data = PrismaShippingAddressMapper.toPrisma(shippingAddress)

    await this.prisma.shippingAddress.create({
      data,
    })
  }

  async save(shippingAddress: ShippingAddress) {
    const data = PrismaShippingAddressMapper.toPrisma(shippingAddress)

    await this.prisma.shippingAddress.update({
      where: {
        id: shippingAddress.id.toString(),
      },
      data,
    })
  }

  async delete(shippingAddress: ShippingAddress) {
    const data = PrismaShippingAddressMapper.toPrisma(shippingAddress)

    await this.prisma.shippingAddress.delete({
      where: {
        id: data.id,
      },
    })
  }
}
