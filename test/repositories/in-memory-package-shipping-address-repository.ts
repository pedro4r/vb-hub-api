import { ShippingAddress } from '@/domain/customer/enterprise/entities/shipping-address'
import { PackageShippingAddressRepository } from '@/domain/customer/application/repositories/package-shipping-address-repository'
import { ShippingAddressRepository } from '@/domain/customer/application/repositories/shipping-address-repository'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

export class InMemoryPackageShippingAddressRepository
  implements PackageShippingAddressRepository
{
  public items: ShippingAddress[] = []

  constructor(private shippingAddressRepository: ShippingAddressRepository) {}

  async findById(shippingAddressId: string) {
    const address = this.items.find(
      (item) => item.id.toString() === shippingAddressId,
    )

    if (!address) {
      return null
    }

    return address
  }

  async create(shippingAddressId: string) {
    const shippingAddress =
      await this.shippingAddressRepository.findById(shippingAddressId)

    if (!shippingAddress) {
      throw new ResourceNotFoundError('Shipping Address not found')
    }

    const packageShippingAddress = ShippingAddress.create({
      customerId: shippingAddress.customerId,
      recipientName: shippingAddress.recipientName,
      address: shippingAddress.address,
      createdAt: new Date(),
    })

    this.items.push(packageShippingAddress)

    return packageShippingAddress.id
  }

  async delete(packageShippingAddressId: string) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === packageShippingAddressId,
    )
    this.items.splice(itemIndex, 1)
  }
}
