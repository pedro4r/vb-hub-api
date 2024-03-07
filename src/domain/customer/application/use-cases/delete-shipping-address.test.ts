import { InMemoryShippingAddressRepository } from 'test/repositories/in-memory-shipping-address-repository'
import { DeleteShippingAddressUseCase } from './delete-shipping-address'
import { makeShippingAddress } from 'test/factories/make-shipping-address'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryShippingAddressRepository: InMemoryShippingAddressRepository
let sut: DeleteShippingAddressUseCase

describe('Delete an Address', () => {
  beforeEach(() => {
    inMemoryShippingAddressRepository = new InMemoryShippingAddressRepository()
    sut = new DeleteShippingAddressUseCase(inMemoryShippingAddressRepository)
  })

  it('should be able to delete a shipping address', async () => {
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

    await sut.execute({
      shippingAddressId: shippingAddress1.id.toString(),
      customerId: shippingAddress1.customerId.toString(),
    })

    expect(inMemoryShippingAddressRepository.items.length === 1).toBeTruthy()
    expect(inMemoryShippingAddressRepository.items[0]).toEqual(shippingAddress2)
  })

  it('not should be able to delete a shipping address when there is only one last', async () => {
    const address = makeShippingAddress(
      {
        customerId: new UniqueEntityID('customer-1'),
      },
      new UniqueEntityID('shipping-address-1'),
    )

    inMemoryShippingAddressRepository.items.push(address)

    const result = await sut.execute({
      shippingAddressId: address.id.toString(),
      customerId: address.customerId.toString(),
    })

    expect(result.isLeft).toBeTruthy()
    expect(inMemoryShippingAddressRepository.items.length === 1).toBeTruthy()
  })

  it('should not be able to delete a shipping address from another customer', async () => {
    const address = makeShippingAddress(
      {
        customerId: new UniqueEntityID('customer-1'),
      },
      new UniqueEntityID('shipping-address-1'),
    )

    inMemoryShippingAddressRepository.items.push(address)

    const result = await sut.execute({
      shippingAddressId: address.id.toString(),
      customerId: 'customer-2',
    })

    expect(result.isLeft).toBeTruthy()
    expect(inMemoryShippingAddressRepository.items.length === 1).toBeTruthy()
  })
})
