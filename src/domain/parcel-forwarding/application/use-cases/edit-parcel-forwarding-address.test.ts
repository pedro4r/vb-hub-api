import { InMemoryParcelForwardingAddressRepository } from 'test/repositories/in-memory-parcel-forwarding-address-repository'
import { EditParcelForwardingAddressUseCase } from './edit-parcel-forwarding-address'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeParcelForwardingAddress } from 'test/factories/make-forwarding-address'

let inMemoryParcelForwardingAddressRepository: InMemoryParcelForwardingAddressRepository
let sut: EditParcelForwardingAddressUseCase

describe('Edit Forwarding Address', () => {
  beforeEach(() => {
    inMemoryParcelForwardingAddressRepository =
      new InMemoryParcelForwardingAddressRepository()
    sut = new EditParcelForwardingAddressUseCase(
      inMemoryParcelForwardingAddressRepository,
    )
  })

  it('should be able to edit a forwarding address', async () => {
    const newParcelForwardingAddress = makeParcelForwardingAddress(
      {
        parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      },
      new UniqueEntityID('forwarding-address-1'),
    )

    await inMemoryParcelForwardingAddressRepository.create(
      newParcelForwardingAddress,
    )

    await sut.execute({
      parcelForwardingAddressId: newParcelForwardingAddress.id.toString(),
      parcelForwardingId:
        newParcelForwardingAddress.parcelForwardingId.toString(),
      address: 'New address',
      complement: 'New complement',
      city: 'New city',
      state: 'New state',
      zipcode: 'New zipcode',
      country: 'New country',
      phoneNumber: 'New phoneNumber',
    })

    expect(
      inMemoryParcelForwardingAddressRepository.items[0].address,
    ).toMatchObject({
      zipcode: 'New zipcode',
    })
  })

  it('should not be able to edit a forwarding address from another parcel forwarding', async () => {
    const newParcelForwardingAddress = makeParcelForwardingAddress(
      {
        parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      },
      new UniqueEntityID('forwarding-address-1'),
    )

    await inMemoryParcelForwardingAddressRepository.create(
      newParcelForwardingAddress,
    )

    const result = await sut.execute({
      parcelForwardingAddressId: newParcelForwardingAddress.id.toString(),
      parcelForwardingId: 'another-customer-id',
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
