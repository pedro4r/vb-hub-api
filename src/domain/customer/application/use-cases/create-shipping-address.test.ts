import { InMemoryShippingAddressRepository } from 'test/repositories/in-memory-shipping-address-repository'
import { CreateShippingAddressUseCase } from './create-shipping-address'

let inMemoryShippingAddressRepository: InMemoryShippingAddressRepository
let sut: CreateShippingAddressUseCase

describe('Create Address', () => {
  beforeEach(() => {
    inMemoryShippingAddressRepository = new InMemoryShippingAddressRepository()
    sut = new CreateShippingAddressUseCase(inMemoryShippingAddressRepository)
  })

  it('should be able to create a shipping address', async () => {
    const result = await sut.execute({
      customerId: '1',
      recipientName: 'John Doe',
      taxId: '123456789',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipcode: '10001',
      country: 'USA',
    })

    expect(result.isRight()).toBe(true)

    expect(inMemoryShippingAddressRepository.items[0]).toEqual(
      result.value?.shippingAddress,
    )
  })
})
