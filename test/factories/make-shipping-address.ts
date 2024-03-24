import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  ShippingAddress,
  ShippingAddressProps,
} from '@/domain/customer/enterprise/entities/shipping-address'

import { faker } from '@faker-js/faker'
import { makeAddress } from './make-address'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaShippingAddressMapper } from '@/infra/database/prisma/mappers/prisma-shipping-address-mapper'

export function makeShippingAddress(
  override: Partial<ShippingAddressProps> = {},
  id?: UniqueEntityID,
) {
  const shippingAddress = ShippingAddress.create(
    {
      customerId: new UniqueEntityID(),
      recipientName: faker.person.firstName(),
      taxId: faker.number.int({ min: 8, max: 10 }).toString(),
      email: faker.internet.email(),
      phoneNumber: faker.number.int({ min: 8, max: 10 }).toString(),
      address: makeAddress(),
      createdAt: new Date(),
      ...override,
    },
    id,
  )

  return shippingAddress
}

@Injectable()
export class ShippingAddressFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaShippingAddress(
    data: Partial<ShippingAddressProps> = {},
  ): Promise<ShippingAddress> {
    const shippingAddress = makeShippingAddress(data)

    await this.prisma.shippingAddress.create({
      data: PrismaShippingAddressMapper.toPrisma(shippingAddress),
    })

    return shippingAddress
  }
}
