import { PackageShippingAddressRepository } from '@/domain/customer/application/repositories/package-shipping-address-repository'
import { ShippingAddressRepository } from '@/domain/customer/application/repositories/shipping-address-repository'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PackageShippingAddress } from '@/domain/customer/enterprise/entities/package-shipping-address'

export class InMemoryPackageShippingAddressRepository
  implements PackageShippingAddressRepository
{
  public items: PackageShippingAddress[] = []

  constructor(private shippingAddressRepository: ShippingAddressRepository) {}

  async findById(id: string) {
    const packageShippingAddress = this.items.find(
      (item) => item.id.toString() === id,
    )

    if (!packageShippingAddress) {
      return null
    }

    return packageShippingAddress
  }

  async create(shippingAddressId: string) {
    const shippingAddress =
      await this.shippingAddressRepository.findById(shippingAddressId)

    if (!shippingAddress) {
      throw new ResourceNotFoundError('Shipping Address not found')
    }

    const packageShippingAddress = PackageShippingAddress.create(
      {
        recipientName: shippingAddress.recipientName,
        address: shippingAddress.address,
        createdAt: new Date(),
      },
      new UniqueEntityID(shippingAddressId),
    )

    this.items.push(packageShippingAddress)
  }

  async delete(shippingAddressId: string) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === shippingAddressId,
    )
    this.items.splice(itemIndex, 1)
  }
}
