import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { GetHubAddressUseCase } from './get-hub-address'
import { InMemoryParcelForwardingAddressesRepository } from 'test/repositories/in-memory-parcel-forwarding-address-repository'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { makeParcelForwardingAddress } from 'test/factories/make-forwarding-address'
import { makeCustomer } from 'test/factories/make-customer'
import { InMemoryShippingAddressRepository } from 'test/repositories/in-memory-shipping-address-repository'
import { makeShippingAddress } from 'test/factories/make-shipping-address'

let inMemoryCustomerRepository: InMemoryCustomerRepository
let inMemoryParcelForwardingAddressesRepository: InMemoryParcelForwardingAddressesRepository
let inMemoryShippingAddressRepository: InMemoryShippingAddressRepository
let sut: GetHubAddressUseCase

describe('Get Hub Address', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    inMemoryParcelForwardingAddressesRepository =
      new InMemoryParcelForwardingAddressesRepository()

    inMemoryShippingAddressRepository = new InMemoryShippingAddressRepository()

    sut = new GetHubAddressUseCase(
      inMemoryCustomerRepository,
      inMemoryParcelForwardingAddressesRepository,
      inMemoryShippingAddressRepository,
    )
  })

  it('should be able to get a hub address', async () => {
    const shippingAddress = makeShippingAddress({
      customerId: new UniqueEntityID('customer-1'),
    })

    await inMemoryShippingAddressRepository.create(shippingAddress)
    const parcelForwardingAddress = makeParcelForwardingAddress(
      {
        parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      },
      new UniqueEntityID('forwarding-address-1'),
    )

    inMemoryParcelForwardingAddressesRepository.items.push(
      parcelForwardingAddress,
    )

    const customer = makeCustomer(
      {
        parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      },
      new UniqueEntityID('customer-1'),
    )

    inMemoryCustomerRepository.items.push(customer)

    const result = await sut.execute({
      customerId: customer.id.toString(),
    })

    if (result.isRight()) {
      console.log(
        JSON.stringify(result.value.hubAddress.customerHubId.customerCode),
      )
    }

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual(
      expect.objectContaining({
        hubAddress: expect.objectContaining({
          customerHubId: expect.objectContaining({
            parcelForwadingInitials: expect.any(String),
            customerCode: expect.any(Number),
          }),
          parcelForwardingAddress: expect.objectContaining({
            id: parcelForwardingAddress.id,
          }),
        }),
      }),
    )
  })

  it('should not be able to get a hub address from another customer', async () => {
    const parcelForwardingAddress = makeParcelForwardingAddress(
      {
        parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      },
      new UniqueEntityID('forwarding-address-1'),
    )

    inMemoryParcelForwardingAddressesRepository.items.push(
      parcelForwardingAddress,
    )

    const customer = makeCustomer(
      {
        parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      },
      new UniqueEntityID('customer-1'),
    )

    inMemoryCustomerRepository.items.push(customer)

    const result = await sut.execute({
      customerId: 'customer-2',
    })

    expect(result.isLeft()).toBeTruthy()
  })

  it('should not be able to get a hub address without a shipping address created', async () => {
    const parcelForwardingAddress = makeParcelForwardingAddress(
      {
        parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      },
      new UniqueEntityID('forwarding-address-1'),
    )

    inMemoryParcelForwardingAddressesRepository.items.push(
      parcelForwardingAddress,
    )

    const customer = makeCustomer(
      {
        parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      },
      new UniqueEntityID('customer-1'),
    )

    inMemoryCustomerRepository.items.push(customer)

    const result = await sut.execute({
      customerId: 'customer-2',
    })

    expect(result.isLeft()).toBeTruthy()
  })
})
