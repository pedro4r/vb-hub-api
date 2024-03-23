import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Address } from '@/core/value-objects/address'
import { ShippingAddress } from '@/domain/customer/enterprise/entities/shipping-address'
import {
  Prisma,
  ShippingAddress as PrismaShippingAddress,
} from '@prisma/client'

export class PrismaShippingAddressMapper {
  static toDomain(raw: PrismaShippingAddress): ShippingAddress {
    const address = Address.create({
      address: raw.address,
      complement: raw.complement,
      city: raw.city,
      state: raw.state,
      zipcode: raw.zipcode,
      country: raw.country,
      phoneNumber: raw.phoneNumber,
    })

    return ShippingAddress.create(
      {
        customerId: new UniqueEntityID(raw.customerId),
        recipientName: raw.recipientName,
        address,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    shippingAddress: ShippingAddress,
  ): Prisma.ShippingAddressUncheckedCreateInput {
    return {
      id: shippingAddress.id.toString(),
      customerId: shippingAddress.customerId.toString(),
      recipientName: shippingAddress.recipientName,
      address: shippingAddress.address.address,
      complement: shippingAddress.address.complement ?? null,
      city: shippingAddress.address.city,
      state: shippingAddress.address.state,
      zipcode: shippingAddress.address.zipcode,
      country: shippingAddress.address.country,
      phoneNumber: shippingAddress.address.phoneNumber,
      createdAt: shippingAddress.createdAt,
      updatedAt: shippingAddress.updatedAt,
    }
  }
}
