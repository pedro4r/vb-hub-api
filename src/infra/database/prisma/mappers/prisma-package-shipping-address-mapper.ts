import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Address } from '@/core/value-objects/address'

import { ShippingAddress } from '@/domain/customer/enterprise/entities/shipping-address'
import { PackageShippingAddress } from '@/domain/customer/enterprise/entities/value-objects/package-shipping-address'
import {
  Prisma,
  PackageShippingAddress as PrismaPackageShippingAddress,
} from '@prisma/client'

export class PrismaPackageShippingAddressMapper {
  static toDomain(raw: PrismaPackageShippingAddress): PackageShippingAddress {
    const address = Address.create({
      address: raw.address,
      complement: raw.complement,
      city: raw.city,
      state: raw.state,
      zipcode: raw.zipcode,
      country: raw.country,
    })

    return PackageShippingAddress.create(
      {
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
  ): Prisma.PackageShippingAddressUncheckedCreateInput {
    return {
      id: shippingAddress.id.toString(),
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
