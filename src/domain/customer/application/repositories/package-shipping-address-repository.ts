import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ShippingAddress } from '../../enterprise/entities/shipping-address'

export abstract class PackageShippingAddressRepository {
  abstract findById(
    packageShippingAddressId: string,
  ): Promise<ShippingAddress | null>

  abstract create(shippingAddressId: string): Promise<UniqueEntityID>
  abstract delete(packageShippingAddressId: string): Promise<void>
}
