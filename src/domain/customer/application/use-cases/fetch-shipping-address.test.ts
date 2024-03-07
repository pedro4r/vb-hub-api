import { InMemoryShippingAddressRepository } from 'test/repositories/in-memory-shipping-address-repository'
import { FetchShippingAddressUseCase } from './fetch-shipping-address'
import { makeShippingAddress } from 'test/factories/make-shipping-address'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ShippingAddress } from '../../enterprise/entities/shipping-address'

let inMemoryShippingAddressRepository: InMemoryShippingAddressRepository
let sut: FetchShippingAddressUseCase

describe('Get a Shipping Address', () => {
  beforeEach(() => {
    inMemoryShippingAddressRepository = new InMemoryShippingAddressRepository()
    sut = new FetchShippingAddressUseCase(inMemoryShippingAddressRepository)
  })

  it('should be able to fetch shipping addresses', async () => {
    const shippingAddress1 = makeShippingAddress(
      {
        customerId: new UniqueEntityID('customer-1'),
      },
      new UniqueEntityID('shipping-address-1'),
    )

    const shippingAddress2 = makeShippingAddress(
      {
        customerId: new UniqueEntityID('customer-1'),
      },
      new UniqueEntityID('shippingAddress-2'),
    )

    const shippingAddress3 = makeShippingAddress(
      {
        customerId: new UniqueEntityID('customer-2'),
      },
      new UniqueEntityID('address-3'),
    )

    inMemoryShippingAddressRepository.items.push(shippingAddress1)
    inMemoryShippingAddressRepository.items.push(shippingAddress2)
    inMemoryShippingAddressRepository.items.push(shippingAddress3)

    const result = await sut.execute({
      customerId: 'customer-1',
    })

    expect(result.isRight()).toBeTruthy()
    expect(
      (result.value as { shippingAddresses: ShippingAddress[] })
        .shippingAddresses.length,
    ).toEqual(2)
  })

  it('should not be able to fetch shipping addresses from another customer', async () => {
    const shippingAddress1 = makeShippingAddress(
      {
        customerId: new UniqueEntityID('customer-1'),
      },
      new UniqueEntityID('shipping-address-1'),
    )

    const shippingAddress2 = makeShippingAddress(
      {
        customerId: new UniqueEntityID('customer-1'),
      },
      new UniqueEntityID('shippingAddress-2'),
    )

    inMemoryShippingAddressRepository.items.push(shippingAddress1)
    inMemoryShippingAddressRepository.items.push(shippingAddress2)

    const result = await sut.execute({
      customerId: 'another-customer',
    })

    expect(result.isLeft()).toBeTruthy()
  })
})
