import { InMemoryCheckInsAttachmentsRepository } from 'test/repositories/in-memory-check-ins-attachments-repository'
import { InMemoryCheckInsRepository } from 'test/repositories/in-memory-check-ins-repository'
import { makeCheckIn } from 'test/factories/make-check-in'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeCheckInAttachment } from 'test/factories/make-check-in-attachment'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { GetCheckInUseCase } from './get-check-in'
import { makeCustomer } from 'test/factories/make-customer'
import { makeAttachment } from 'test/factories/make-attachment'

let inMemoryCustomerRepository: InMemoryCustomerRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let inMemoryCheckInsAttachmentsRepository: InMemoryCheckInsAttachmentsRepository
let sut: GetCheckInUseCase

describe('Get Check-in', () => {
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

    sut = new GetCheckInUseCase(inMemoryCheckInsRepository)
  })

  it('should be able to get a check-in', async () => {
    const customer = makeCustomer(
      {
        parcelForwardingId: new UniqueEntityID('company-1'),
      },
      new UniqueEntityID('customer-1'),
    )

    await inMemoryCustomerRepository.create(customer)

    inMemoryAttachmentsRepository.items.push(
      makeAttachment({}, new UniqueEntityID('1')),
      makeAttachment({}, new UniqueEntityID('1')),
    )

    const newCheckIn = makeCheckIn(
      {
        parcelForwardingId: new UniqueEntityID('company-1'),
        customerId: new UniqueEntityID('customer-1'),
      },
      new UniqueEntityID('check-in-1'),
    )

    await inMemoryCheckInsRepository.create(newCheckIn)

    inMemoryCheckInsAttachmentsRepository.items.push(
      makeCheckInAttachment({
        checkInId: newCheckIn.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeCheckInAttachment({
        checkInId: newCheckIn.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({
      checkInId: 'check-in-1',
      parcelForwardingId: 'company-1',
    })

    expect(inMemoryCheckInsRepository.items).toHaveLength(1)
    expect(inMemoryCheckInsAttachmentsRepository.items).toHaveLength(2)
  })

  it('should not be able to get a check-in from another Parcel Forwarding Company', async () => {
    const customer = makeCustomer(
      {
        parcelForwardingId: new UniqueEntityID('company-1'),
      },
      new UniqueEntityID('customer-1'),
    )

    await inMemoryCustomerRepository.create(customer)

    inMemoryAttachmentsRepository.items.push(
      makeAttachment({}, new UniqueEntityID('1')),
      makeAttachment({}, new UniqueEntityID('1')),
    )

    const newCheckIn = makeCheckIn(
      {
        parcelForwardingId: new UniqueEntityID('company-1'),
        customerId: new UniqueEntityID('customer-1'),
      },
      new UniqueEntityID('check-in-1'),
    )

    await inMemoryCheckInsRepository.create(newCheckIn)

    inMemoryCheckInsAttachmentsRepository.items.push(
      makeCheckInAttachment({
        checkInId: newCheckIn.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeCheckInAttachment({
        checkInId: newCheckIn.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    const result = await sut.execute({
      checkInId: 'check-in-1',
      parcelForwardingId: 'company-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
