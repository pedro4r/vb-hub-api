import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { makeCustomer } from 'test/factories/make-customer'
import { FetchCustomersByNameUseCase } from './fetch-customers-by-name'

let inMemoryCustomerRepository: InMemoryCustomerRepository
let sut: FetchCustomersByNameUseCase

describe('Fetch Customers By Name', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository()

    sut = new FetchCustomersByNameUseCase(inMemoryCustomerRepository)
  })

  it('should be able to fetch customers by name', async () => {
    const customer1 = makeCustomer(
      {
        firstName: 'John',
        lastName: 'Doe',
        parcelForwardingId: new UniqueEntityID('company-1'),
      },
      new UniqueEntityID('customer-1'),
    )

    const customer2 = makeCustomer(
      {
        firstName: 'Jane',
        lastName: 'Doe',
        parcelForwardingId: new UniqueEntityID('company-1'),
      },
      new UniqueEntityID('customer-1'),
    )

    await inMemoryCustomerRepository.create(customer1)
    await inMemoryCustomerRepository.create(customer2)

    const result = await sut.execute({
      name: 'do',
      page: 1,
      parcelForwardingId: 'company-1',
    })

    expect(result.isRight()).toBe(true)

    expect(result.value).toEqual({
      customersData: expect.objectContaining({
        customers: expect.arrayContaining([
          expect.objectContaining({
            firstName: 'John',
            lastName: 'Doe',
          }),
          expect.objectContaining({
            firstName: 'Jane',
            lastName: 'Doe',
          }),
        ]),
        meta: expect.objectContaining({
          pageIndex: 1,
          perPage: 5,
          totalCount: 2,
        }),
      }),
    })

    const result2 = await sut.execute({
      name: 'jo',
      page: 1,
      parcelForwardingId: 'company-1',
    })

    expect(result2.value).toEqual({
      customersData: expect.objectContaining({
        customers: expect.arrayContaining([
          expect.objectContaining({
            firstName: 'John',
            lastName: 'Doe',
          }),
        ]),
        meta: expect.objectContaining({
          pageIndex: 1,
          perPage: 5,
          totalCount: 1,
        }),
      }),
    })
  })
})
