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
    })

    return ShippingAddress.create(
      {
        customerId: new UniqueEntityID(raw.customerId),
        recipientName: raw.recipientName,
        taxId: raw.taxId ?? null,
        email: raw.email ?? null,
        phone: raw.phone ?? null,
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
      taxId: shippingAddress.taxId ?? null,
      email: shippingAddress.email ?? null,
      phone: shippingAddress.phone ?? null,
      address: shippingAddress.address.address,
      complement: shippingAddress.address.complement ?? null,
      city: shippingAddress.address.city,
      state: shippingAddress.address.state,
      zipcode: shippingAddress.address.zipcode,
      country: shippingAddress.address.country,
      createdAt: shippingAddress.createdAt,
      updatedAt: shippingAddress.updatedAt,
    }
  }
}
