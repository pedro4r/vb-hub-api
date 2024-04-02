import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Package,
  PackageProps,
} from '@/domain/customer/enterprise/entities/package'
import { PrismaPackageMapper } from '@/infra/database/prisma/mappers/prisma-package-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makePackage(
  override: Partial<PackageProps> = {},
  id?: UniqueEntityID,
) {
  const address = Package.create(
    {
      customerId: new UniqueEntityID('customer-1'),
      parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      shippingAddressId: new UniqueEntityID('shipping-address-1'),
      hasBattery: false,
      ...override,
    },
    id,
  )

  return address
}

@Injectable()
export class PackageFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaPackage(data: Partial<PackageProps> = {}): Promise<Package> {
    const pkg = makePackage(data)

    await this.prisma.package.create({
      data: PrismaPackageMapper.toPrisma(pkg),
    })

    return pkg
  }
}
