import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryCheckInsRepository } from 'test/repositories/in-memory-check-ins-repository'
import { InMemoryCheckInsAttachmentsRepository } from 'test/repositories/in-memory-check-ins-attachments-repository'

import { makeCheckIn } from 'test/factories/make-check-in'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { makeCustomer } from 'test/factories/make-customer'
import { CheckInsStatusMetricsUseCase } from './check-ins-status-metrics'

let inMemoryCustomerRepository: InMemoryCustomerRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryCheckInsAttachmentsRepository: InMemoryCheckInsAttachmentsRepository
let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: CheckInsStatusMetricsUseCase

describe('Filter Check-ins', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()

    inMemoryCheckInsAttachmentsRepository =
      new InMemoryCheckInsAttachmentsRepository()

    inMemoryCheckInsRepository = new InMemoryCheckInsRepository(
      inMemoryCheckInsAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryCustomerRepository,
    )
    sut = new CheckInsStatusMetricsUseCase(inMemoryCheckInsRepository)
  })

  it('should be able to get Check-ins Status metrics', async () => {
    const customer1 = makeCustomer(
      {
        firstName: 'John',
        hubId: 123,
        parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      },
      new UniqueEntityID('customer-1'),
    )
    const customer2 = makeCustomer(
      {
        firstName: 'Smith',
        parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      },
      new UniqueEntityID('customer-2'),
    )
    const customer3 = makeCustomer(
      {
        firstName: 'Hugo',
        parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      },
      new UniqueEntityID('customer-3'),
    )
    const customer4 = makeCustomer(
      {
        firstName: 'Taylor',
        parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      },
      new UniqueEntityID('customer-4'),
    )
    const customer5 = makeCustomer(
      {
        firstName: 'Feyd',
        parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      },
      new UniqueEntityID('customer-5'),
    )

    await Promise.all([
      inMemoryCustomerRepository.create(customer1),
      inMemoryCustomerRepository.create(customer2),
      inMemoryCustomerRepository.create(customer3),
      inMemoryCustomerRepository.create(customer4),
      inMemoryCustomerRepository.create(customer5),
    ])

    const checkIn0 = makeCheckIn({
      parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      customerId: customer1.id,
      status: 1,
      createdAt: new Date('2020-12-01'),
    })

    const checkIn1 = makeCheckIn({
      parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      customerId: customer1.id,
      status: 1,
      createdAt: new Date('2021-01-01'),
    })

    const checkIn2 = makeCheckIn({
      parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      customerId: customer2.id,
      status: 1,
      createdAt: new Date('2021-01-02'),
    })
    const checkIn3 = makeCheckIn({
      parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      customerId: customer3.id,
      status: 1,
      createdAt: new Date('2021-01-03'),
    })
    const checkIn4 = makeCheckIn({
      parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      customerId: customer4.id,
      status: 4,
      createdAt: new Date('2021-01-04'),
    })
    const checkIn5 = makeCheckIn({
      parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      customerId: customer5.id,
      status: 7,
      createdAt: new Date('2021-01-05'),
    })

    await Promise.all([
      inMemoryCheckInsRepository.create(checkIn0),
      inMemoryCheckInsRepository.create(checkIn1),
      inMemoryCheckInsRepository.create(checkIn2),
      inMemoryCheckInsRepository.create(checkIn3),
      inMemoryCheckInsRepository.create(checkIn4),
      inMemoryCheckInsRepository.create(checkIn5),
    ])

    const result = await sut.execute({
      parcelForwardingId: 'parcel-forwarding-1',
    })

    expect(inMemoryCheckInsRepository.items.length).toEqual(6)

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual(
      expect.objectContaining({
        checkInStatusMetrics: expect.objectContaining({
          metrics: expect.objectContaining({
            received: 4,
            pending: 0,
            shipped: 0,
            delivered: 1,
            withdrawn: 0,
            abandoned: 0,
            returned: 1,
          }),
          totalCount: 6,
        }),
      }),
    )

    const result2 = await sut.execute({
      parcelForwardingId: 'parcel-forwarding-1',
      metrics: ['received', 'pending', 'returned', 'shipped'],
    })

    expect(result2.isRight()).toBeTruthy()
    expect(result2.value).toEqual(
      expect.objectContaining({
        checkInStatusMetrics: expect.objectContaining({
          metrics: expect.objectContaining({
            received: 4,
            returned: 1,
            shipped: 0,
            pending: 0,
          }),
          totalCount: 5,
        }),
      }),
    )
  })
})
