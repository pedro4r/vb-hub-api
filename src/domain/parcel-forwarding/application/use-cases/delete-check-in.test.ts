import { InMemoryCheckInsAttachmentsRepository } from 'test/repositories/in-memory-check-ins-attachments-repository'
import { InMemoryCheckInsRepository } from 'test/repositories/in-memory-check-ins-repository'
import { DeleteCheckInUseCase } from './delete-check-in'
import { makeCheckIn } from 'test/factories/make-check-in'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeCheckInAttachment } from 'test/factories/make-check-in-attachment'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let inMemoryCheckInsAttachmentsRepository: InMemoryCheckInsAttachmentsRepository
let sut: DeleteCheckInUseCase

describe('Delete Check-in', () => {
  beforeEach(() => {
    inMemoryCheckInsAttachmentsRepository =
      new InMemoryCheckInsAttachmentsRepository()
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository(
      inMemoryCheckInsAttachmentsRepository,
    )

    sut = new DeleteCheckInUseCase(inMemoryCheckInsRepository)
  })

  it('should be able to delete a check-in', async () => {
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
      customerId: 'customer-1',
    })

    expect(inMemoryCheckInsRepository.items).toHaveLength(0)
    expect(inMemoryCheckInsAttachmentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a check-in through parcel-forwarding', async () => {
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
      customerId: 'customer-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
