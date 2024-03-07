import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Package,
  PackageProps,
} from '@/domain/customer/enterprise/entities/package'

export function makePackage(
  override: Partial<PackageProps> = {},
  id?: UniqueEntityID,
) {
  const address = Package.create(
    {
      customerId: new UniqueEntityID('customer-1'),
      parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      shippingAddressId: new UniqueEntityID('shipping-address-1'),
      checkInsId: [new UniqueEntityID('checkin-1')],
      customsDeclarationId: new UniqueEntityID('customs-declaration-1'),
      taxId: new UniqueEntityID('tax-1'),
      hasBattery: false,
      ...override,
    },
    id,
  )

  return address
}
