import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  ShippingAddress,
  ShippingAddressProps,
} from '@/domain/customer/enterprise/entities/shipping-address'
import { faker } from '@faker-js/faker'
import { makeAddress } from './make-address'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaPackageShippingAddressMapper } from '@/infra/database/prisma/mappers/prisma-package-shipping-address-mapper'

export function makePackageShippingAddress(
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
export class PackageShippingAddressFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaPackageShippingAddress(
    data: Partial<ShippingAddressProps> = {},
  ): Promise<ShippingAddress> {
    const shippingAddress = makePackageShippingAddress(data)

    await this.prisma.packageShippingAddress.create({
      data: PrismaPackageShippingAddressMapper.toPrisma(shippingAddress),
    })

    return shippingAddress
  }
}
