import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Package } from '@/domain/customer/enterprise/entities/package'
import { Prisma, Package as PrismaPackage } from '@prisma/client'

export class PrismaPackageMapper {
  static toDomain(raw: PrismaPackage): Package {
    return Package.create(
      {
        customerId: new UniqueEntityID(raw.customerId),
        parcelForwardingId: new UniqueEntityID(raw.parcelForwardingId),
        shippingAddressId: new UniqueEntityID(raw.packageShippingAddressId),
        weight: raw.weight,
        hasBattery: raw.hasBattery,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(pkg: Package): Prisma.PackageUncheckedCreateInput {
    return {
      id: pkg.id.toString(),
      customerId: pkg.customerId.toString(),
      parcelForwardingId: pkg.parcelForwardingId.toString(),
      packageShippingAddressId: pkg.shippingAddressId.toString(),
      weight: pkg.weight ?? null,
      hasBattery: pkg.hasBattery,
      trackingNumber: pkg.trackingNumber ?? null,
    }
  }
}
