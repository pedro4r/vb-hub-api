import { ShippingAddress } from '../../enterprise/entities/shipping-address'

export abstract class ShippingAddressRepository {
  abstract findManyByCustomerId(customerId: string): Promise<ShippingAddress[]>
  abstract findById(shippingAddressId: string): Promise<ShippingAddress | null>
  abstract create(shippingAddress: ShippingAddress): Promise<void>
  abstract save(shippingAddress: ShippingAddress): Promise<void>
  abstract delete(shippingAddress: ShippingAddress): Promise<void>
}
