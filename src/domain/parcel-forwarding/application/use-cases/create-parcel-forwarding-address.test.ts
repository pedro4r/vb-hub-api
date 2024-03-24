import { InMemoryParcelForwardingAddressesRepository } from 'test/repositories/in-memory-parcel-forwarding-address-repository'
import { CreateParcelForwardingAddressUseCase } from './create-parcel-forwarding-address'

let inMemoryParcelForwardingAddressesRepository: InMemoryParcelForwardingAddressesRepository
let sut: CreateParcelForwardingAddressUseCase

describe('Create Forwarding Address', () => {
  beforeEach(() => {
    inMemoryParcelForwardingAddressesRepository =
      new InMemoryParcelForwardingAddressesRepository()
    sut = new CreateParcelForwardingAddressUseCase(
      inMemoryParcelForwardingAddressesRepository,
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
    })

    expect(result.isRight()).toBe(true)

    expect(inMemoryParcelForwardingAddressesRepository.items[0]).toEqual(
      result.value?.parcelForwardingAddress,
    )
  })
})
