import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryCheckInsRepository } from 'test/repositories/in-memory-check-ins-repository'
import { InMemoryCheckInsAttachmentsRepository } from 'test/repositories/in-memory-check-ins-attachments-repository'

import { makeCheckIn } from 'test/factories/make-check-in'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { makeCustomer } from 'test/factories/make-customer'
import { makeAttachment } from 'test/factories/make-attachment'
import { makeCheckInAttachment } from 'test/factories/make-check-in-attachment'
import { FilterCheckInsDetailsUseCase } from './filter-check-ins-details'

let inMemoryCustomerRepository: InMemoryCustomerRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryCheckInsAttachmentsRepository: InMemoryCheckInsAttachmentsRepository
let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: FilterCheckInsDetailsUseCase

describe('Fetch Recent Check-ins Details', () => {
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
    sut = new FilterCheckInsDetailsUseCase(
      inMemoryCheckInsRepository,
      inMemoryCustomerRepository,
    )
  })

  it('should be able to fetch recent check-ins details', async () => {
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

    inMemoryAttachmentsRepository.items.push(
      makeAttachment({}, new UniqueEntityID('attachment-1')),
      makeAttachment({}, new UniqueEntityID('attachment-2')),
      makeAttachment({}, new UniqueEntityID('attachment-3')),
      makeAttachment({}, new UniqueEntityID('attachment-4')),
      makeAttachment({}, new UniqueEntityID('attachment-5')),
      makeAttachment({}, new UniqueEntityID('attachment-6')),
    )

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

    inMemoryCheckInsAttachmentsRepository.items.push(
      makeCheckInAttachment({
        checkInId: checkIn0.id,
        attachmentId: new UniqueEntityID('attachment-1'),
      }),
      makeCheckInAttachment({
        checkInId: checkIn1.id,
        attachmentId: new UniqueEntityID('attachment-2'),
      }),
      makeCheckInAttachment({
        checkInId: checkIn1.id,
        attachmentId: new UniqueEntityID('attachment-3'),
      }),
      makeCheckInAttachment({
        checkInId: checkIn2.id,
        attachmentId: new UniqueEntityID('attachment-4'),
      }),
      makeCheckInAttachment({
        checkInId: checkIn3.id,
        attachmentId: new UniqueEntityID('attachment-5'),
      }),
      makeCheckInAttachment({
        checkInId: checkIn4.id,
        attachmentId: new UniqueEntityID('attachment-5'),
      }),
      makeCheckInAttachment({
        checkInId: checkIn5.id,
        attachmentId: new UniqueEntityID('attachment-5'),
      }),
    )

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
        checkInsAttachmentData: expect.objectContaining({
          checkInsAttachments: expect.arrayContaining([
            expect.objectContaining({
              checkInId: checkIn1.id,
              customerId: customer1.id,
              parcelForwardingId: checkIn1.parcelForwardingId,
              attachment: expect.objectContaining({
                id: new UniqueEntityID('attachment-2'),
                url: expect.any(String),
              }),
            }),
            expect.objectContaining({
              checkInId: checkIn1.id,
              customerId: customer1.id,
              parcelForwardingId: checkIn1.parcelForwardingId,
              attachment: expect.objectContaining({
                id: new UniqueEntityID('attachment-3'),
                url: expect.any(String),
              }),
            }),
            expect.objectContaining({
              checkInId: checkIn2.id,
              customerId: customer2.id,
              parcelForwardingId: checkIn1.parcelForwardingId,
              attachment: expect.objectContaining({
                id: new UniqueEntityID('attachment-4'),
                url: expect.any(String),
              }),
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
