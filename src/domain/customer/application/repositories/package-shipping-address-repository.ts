import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ShippingAddress } from '../../enterprise/entities/shipping-address'

export abstract class PackageShippingAddressRepository {
  abstract findById(shippingAddressId: string): Promise<ShippingAddress | null>
  abstract create(shippingAddressId: string): Promise<UniqueEntityID>
  abstract delete(shippingAddressId: string): Promise<void>
}
