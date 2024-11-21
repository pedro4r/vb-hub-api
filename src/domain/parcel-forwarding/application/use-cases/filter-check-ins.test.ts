import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryCheckInsRepository } from 'test/repositories/in-memory-check-ins-repository'
import { InMemoryCheckInsAttachmentsRepository } from 'test/repositories/in-memory-check-ins-attachments-repository'

import { makeCheckIn } from 'test/factories/make-check-in'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { makeCustomer } from 'test/factories/make-customer'
import { FilterCheckInsUseCase } from './filter-check-ins'

let inMemoryCustomerRepository: InMemoryCustomerRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryCheckInsAttachmentsRepository: InMemoryCheckInsAttachmentsRepository
let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: FilterCheckInsUseCase

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
    sut = new FilterCheckInsUseCase(
      inMemoryCheckInsRepository,
      inMemoryCustomerRepository,
    )
  })

  it('should be able to filter check-ins', async () => {
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
      customerName: 'h', // John and Smith
      parcelForwardingId: 'parcel-forwarding-1',
      checkInStatus: 1,
      startDate: new Date('2021-01-01'),
      endDate: new Date('2021-01-02'),
      page: 1,
    })

    expect(inMemoryCheckInsRepository.items.length).toEqual(6)

    expect(result.isRight()).toBeTruthy()

    expect(result.value).toEqual(
      expect.objectContaining({
        checkInsData: expect.objectContaining({
          checkIns: expect.arrayContaining([
            expect.objectContaining({
              checkInId: checkIn1.id,
              customerId: customer1.id,
              parcelForwardingId: checkIn1.parcelForwardingId,
            }),
            expect.objectContaining({
              checkInId: checkIn2.id,
              customerId: customer2.id,
              parcelForwardingId: checkIn2.parcelForwardingId,
            }),
          ]),
        }),
      }),
    )

    const result2 = await sut.execute({
      hubId: 123,
      parcelForwardingId: 'parcel-forwarding-1',
      startDate: new Date('2020-12-01'),
      endDate: new Date('2020-12-02'),
      page: 1,
    })

    expect(result2.value).toEqual(
      expect.objectContaining({
        checkInsData: expect.objectContaining({
          checkIns: expect.arrayContaining([
            expect.objectContaining({
              checkInId: checkIn0.id,
              customerId: customer1.id,
              parcelForwardingId: checkIn1.parcelForwardingId,
            }),
          ]),
        }),
      }),
    )
  })

  it('should not be able to fetch recent check-ins', async () => {
    const checkIn1 = makeCheckIn({
      parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      createdAt: new Date('2021-01-01'),
    })
    const checkIn2 = makeCheckIn({
      parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      createdAt: new Date('2021-01-02'),
    })

    await inMemoryCheckInsRepository.create(checkIn1)
    await inMemoryCheckInsRepository.create(checkIn2)

    const result = await sut.execute({
      parcelForwardingId: 'parcel-forwarding-2',
      page: 1,
    })

    expect(inMemoryCheckInsRepository.items.length).toEqual(2)
    expect(result.isLeft()).toBeTruthy()
  })
})
