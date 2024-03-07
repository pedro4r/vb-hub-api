import { InMemoryShippingAddressRepository } from 'test/repositories/in-memory-shipping-address-repository'
import { makeShippingAddress } from 'test/factories/make-shipping-address'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { GetShippingAddressUseCase } from './get-shipping-address'

let inMemoryShippingAddressRepository: InMemoryShippingAddressRepository

let sut: GetShippingAddressUseCase

describe('Get a Shipping Address', () => {
  beforeEach(() => {
    inMemoryShippingAddressRepository = new InMemoryShippingAddressRepository()
    sut = new GetShippingAddressUseCase(inMemoryShippingAddressRepository)
  })

  it('should be able to get a shipping address', async () => {
    const shippingAddress = makeShippingAddress(
      {
        customerId: new UniqueEntityID('customer-1'),
      },
      new UniqueEntityID('shipping-address-1'),
    )

    inMemoryShippingAddressRepository.items.push(shippingAddress)

    const result = await sut.execute({
      customerId: shippingAddress.customerId.toString(),
      shippingAddressId: shippingAddress.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryShippingAddressRepository.items[0].address).toMatchObject({
      zipcode: shippingAddress.address.zipcode,
    })
  })

  it('should not be able to get a shipping address from another customer', async () => {
    const shippingAddress = makeShippingAddress(
      {
        customerId: new UniqueEntityID('customer-1'),
      },
      new UniqueEntityID('shipping-address-1'),
    )

    inMemoryShippingAddressRepository.items.push(shippingAddress)

    const result = await sut.execute({
      customerId: 'another-customer-id',
      shippingAddressId: shippingAddress.id.toString(),
    })

    expect(result.isLeft()).toBeTruthy()
  })
})
