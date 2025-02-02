import { PackageShippingAddress } from '../../enterprise/entities/value-objects/package-shipping-address'

export abstract class PackageShippingAddressRepository {
  abstract findById(
    shippingAddressId: string,
  ): Promise<PackageShippingAddress | null>

  abstract create(shippingAddressId: string): Promise<void>
  abstract delete(shippingAddressId: string): Promise<void>
}
