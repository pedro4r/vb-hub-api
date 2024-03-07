import { InMemoryParcelForwardingAddressRepository } from 'test/repositories/in-memory-parcel-forwarding-address-repository'
import { CreateParcelForwardingAddressUseCase } from './create-parcel-forwarding-address'

let inMemoryParcelForwardingAddressRepository: InMemoryParcelForwardingAddressRepository
let sut: CreateParcelForwardingAddressUseCase

describe('Create Forwarding Address', () => {
  beforeEach(() => {
    inMemoryParcelForwardingAddressRepository =
      new InMemoryParcelForwardingAddressRepository()
    sut = new CreateParcelForwardingAddressUseCase(
      inMemoryParcelForwardingAddressRepository,
    )
  })

  it('should be able to create a forwarding address', async () => {
    const result = await sut.execute({
      parcelForwardingId: '1',
      address: '1234 Main St',
      complement: 'Apt 123',
      city: 'Springfield',
      state: 'IL',
      zipcode: '62701',
      country: 'USA',
      phoneNumber: '555-555-5555',
    })

    expect(result.isRight()).toBe(true)

    expect(inMemoryParcelForwardingAddressRepository.items[0]).toEqual(
      result.value?.parcelForwardingAddress,
    )
  })
})
