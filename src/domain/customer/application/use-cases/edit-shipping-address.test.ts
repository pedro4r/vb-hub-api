import { InMemoryShippingAddressRepository } from 'test/repositories/in-memory-shipping-address-repository'
import { EditShippingAddressUseCase } from './edit-shipping-address'
import { makeShippingAddress } from 'test/factories/make-shipping-address'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryShippingAddressRepository: InMemoryShippingAddressRepository
let sut: EditShippingAddressUseCase

describe('Edit Shipping Address', () => {
  beforeEach(() => {
    inMemoryShippingAddressRepository = new InMemoryShippingAddressRepository()
    sut = new EditShippingAddressUseCase(inMemoryShippingAddressRepository)
  })

  it('should be able to edit a shipping address', async () => {
    const newShippingAddress = makeShippingAddress(
      {
        customerId: new UniqueEntityID('customer-1'),
      },
      new UniqueEntityID('shipping-address-1'),
    )

    await inMemoryShippingAddressRepository.create(newShippingAddress)

    await sut.execute({
      shippingAddressId: newShippingAddress.id.toString(),
      customerId: newShippingAddress.customerId.toString(),
      recipientName: 'New recipient name',
      address: 'New address',
      complement: 'New complement',
      city: 'New city',
      state: 'New state',
      zipcode: 'New zipcode',
      country: 'New country',
      phoneNumber: 'New phoneNumber',
    })

    expect(inMemoryShippingAddressRepository.items[0].address).toMatchObject({
      zipcode: 'New zipcode',
    })
  })

  it('should not be able to edit a shipping address from another customer', async () => {
    const newShippingAddress = makeShippingAddress(
      {
        customerId: new UniqueEntityID('customer-1'),
      },
      new UniqueEntityID('shipping-address-1'),
    )

    await inMemoryShippingAddressRepository.create(newShippingAddress)

    const result = await sut.execute({
      shippingAddressId: newShippingAddress.id.toString(),
      customerId: 'another-customer-id',
      recipientName: 'New recipient name',
      address: 'New address',
      complement: 'New complement',
      city: 'New city',
      state: 'New state',
      zipcode: 'New zipcode',
      country: 'New country',
      phoneNumber: 'New phoneNumber',
    })

    expect(result.isLeft).toBeTruthy()
  })
})
