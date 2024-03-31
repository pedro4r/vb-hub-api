import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchRecentCheckInsUseCase } from './fetch-recent-check-ins'
import { InMemoryCheckInsRepository } from 'test/repositories/in-memory-check-ins-repository'
import { InMemoryCheckInsAttachmentsRepository } from 'test/repositories/in-memory-check-ins-attachments-repository'

import { makeCheckIn } from 'test/factories/make-check-in'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { makeCustomer } from 'test/factories/make-customer'

let inMemoryCustomerRepository: InMemoryCustomerRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryCheckInsAttachmentsRepository: InMemoryCheckInsAttachmentsRepository
let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: FetchRecentCheckInsUseCase

describe('Fetch Recent Check-ins', () => {
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
    sut = new FetchRecentCheckInsUseCase(inMemoryCheckInsRepository)
  })

  it('should be able to fetch recent check-ins', async () => {
    const customer1 = makeCustomer({}, new UniqueEntityID('customer-1'))
    const customer2 = makeCustomer({}, new UniqueEntityID('customer-2'))
    const customer3 = makeCustomer({}, new UniqueEntityID('customer-3'))
    const customer4 = makeCustomer({}, new UniqueEntityID('customer-4'))

    await Promise.all([
      inMemoryCustomerRepository.create(customer1),
      inMemoryCustomerRepository.create(customer2),
      inMemoryCustomerRepository.create(customer3),
      inMemoryCustomerRepository.create(customer4),
    ])

    const checkIn1 = makeCheckIn({
      parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      customerId: customer1.id,
      createdAt: new Date('2021-01-01'),
    })
    const checkIn2 = makeCheckIn({
      parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      customerId: customer2.id,
      createdAt: new Date('2021-01-02'),
    })
    const checkIn3 = makeCheckIn({
      parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      customerId: customer3.id,
      createdAt: new Date('2021-01-03'),
    })
    const checkIn4 = makeCheckIn({
      parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      customerId: customer4.id,
      createdAt: new Date('2021-01-04'),
    })

    await Promise.all([
      inMemoryCheckInsRepository.create(checkIn1),
      inMemoryCheckInsRepository.create(checkIn2),
      inMemoryCheckInsRepository.create(checkIn3),
      inMemoryCheckInsRepository.create(checkIn4),
    ])

    const result = await sut.execute({
      parcelForwardingId: 'parcel-forwarding-1',
      page: 1,
    })

    expect(inMemoryCheckInsRepository.items.length).toEqual(4)

    expect(result.isRight()).toBeTruthy()

    expect(result.value).toEqual({
      checkInsPreview: expect.arrayContaining([
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
        expect.objectContaining({
          checkInId: checkIn3.id,
          customerId: customer3.id,
          parcelForwardingId: checkIn3.parcelForwardingId,
        }),
        expect.objectContaining({
          checkInId: checkIn4.id,
          customerId: customer4.id,
          parcelForwardingId: checkIn4.parcelForwardingId,
        }),
      ]),
    })
  })

  it.skip('should not be able to fetch recent check-ins', async () => {
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
