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
      taxId: 'tax-1',
      hasBattery: false,
      ...override,
    },
    id,
  )

  return address
}
