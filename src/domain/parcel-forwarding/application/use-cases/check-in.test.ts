import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from 'test/repositories/in-memory-check-ins-repository'
import { InMemoryCheckInsAttachmentsRepository } from 'test/repositories/in-memory-check-ins-attachments-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let inMemoryCheckInsAttachmentsRepository: InMemoryCheckInsAttachmentsRepository

let sut: CheckInUseCase

describe('Check-in', () => {
  beforeEach(() => {
    inMemoryCheckInsAttachmentsRepository =
      new InMemoryCheckInsAttachmentsRepository()
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository(
      inMemoryCheckInsAttachmentsRepository,
    )
    sut = new CheckInUseCase(inMemoryCheckInsRepository)
  })

  it('should be able to check in', async () => {
    const result = await sut.execute({
      parcelForwardingId: 'A1',
      customerId: 'A2',
      status: 1,
      details: 'Package details',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCheckInsRepository.items[0]).toEqual(result.value?.checkin)
    expect(
      inMemoryCheckInsRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(
      inMemoryCheckInsRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })
  it('should persist attachments when check in', async () => {
    const result = await sut.execute({
      parcelForwardingId: 'A1',
      customerId: 'A2',
      status: 1,
      details: 'Package details',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCheckInsAttachmentsRepository.items).toHaveLength(2)
    expect(inMemoryCheckInsAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
      ]),
    )
  })
})
