import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { makeCustomer } from 'test/factories/make-customer'
import { GetCustomerByHubIdUseCase } from './get-customer-by-hub-id'

let inMemoryCustomerRepository: InMemoryCustomerRepository
let sut: GetCustomerByHubIdUseCase

describe('Get Customer By HubId', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository()

    sut = new GetCustomerByHubIdUseCase(inMemoryCustomerRepository)
  })

  it('should be able to get a customer by HubId', async () => {
    const customer = makeCustomer(
      {
        parcelForwardingId: new UniqueEntityID('company-1'),
      },
      new UniqueEntityID('customer-1'),
    )

    await inMemoryCustomerRepository.create(customer)

    const result = await sut.execute({
      hubId: customer.hubId,
      parcelForwardingId: 'company-1',
    })

    expect(result.value).toEqual({
      customerPreview: expect.objectContaining({
        customerId: new UniqueEntityID('customer-1'),
        firstName: expect.any(String),
      }),
    })

    expect(inMemoryCustomerRepository.items).toHaveLength(1)
  })
})
