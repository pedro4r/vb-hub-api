import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  ShippingAddress,
  ShippingAddressProps,
} from '@/domain/customer/enterprise/entities/shipping-address'

import { faker } from '@faker-js/faker'
import { makeAddress } from './make-address'

export function makeShippingAddress(
  override: Partial<ShippingAddressProps> = {},
  id?: UniqueEntityID,
) {
  const shippingAddress = ShippingAddress.create(
    {
      customerId: new UniqueEntityID(),
      recipientName: faker.person.firstName(),
      address: makeAddress(),
      createdAt: new Date(),
      ...override,
    },
    id,
  )

  return shippingAddress
}
