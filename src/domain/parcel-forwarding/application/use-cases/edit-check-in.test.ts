import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeCheckIn } from 'test/factories/make-check-in'
import { InMemoryCheckInsAttachmentsRepository } from 'test/repositories/in-memory-check-ins-attachments-repository'
import { InMemoryCheckInsRepository } from 'test/repositories/in-memory-check-ins-repository'
import { EditCheckInUseCase } from './edit-check-in'
import { makeCheckInAttachment } from 'test/factories/make-check-in-attachment'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let inMemoryCustomerRepository: InMemoryCustomerRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let inMemoryCheckInsAttachmentsRepository: InMemoryCheckInsAttachmentsRepository
let sut: EditCheckInUseCase

describe('Edit Question', () => {
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

    sut = new EditCheckInUseCase(
      inMemoryCheckInsRepository,
      inMemoryCheckInsAttachmentsRepository,
    )
  })

  it('should be able to edit a check-in', async () => {
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
      checkInId: newCheckIn.id.toValue(),
      customerId: newCheckIn.customerId.toValue(),
      details: 'New details',
      attachmentsIds: ['1', '3'],
    })

    expect(inMemoryCheckInsRepository.items[0]).toMatchObject({
      details: 'New details',
    })

    expect(
      inMemoryCheckInsRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(
      inMemoryCheckInsRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it('should sync new and removed attachment when editing a check-in', async () => {
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
      checkInId: newCheckIn.id.toValue(),
      customerId: newCheckIn.customerId.toValue(),
      details: 'New details',
      attachmentsIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCheckInsAttachmentsRepository.items).toHaveLength(2)
    expect(inMemoryCheckInsAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('3'),
        }),
      ]),
    )
  })
})
