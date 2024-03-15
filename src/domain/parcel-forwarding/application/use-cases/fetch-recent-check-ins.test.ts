import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchRecentCheckInsUseCase } from './fetch-recent-check-ins'
import { InMemoryCheckInsRepository } from 'test/repositories/in-memory-check-ins-repository'
import { InMemoryCheckInsAttachmentsRepository } from 'test/repositories/in-memory-check-ins-attachments-repository'

import { makeCheckIn } from 'test/factories/make-check-in'
import { CheckIn } from '../../enterprise/entities/check-in'

let inMemoryCheckInsAttachmentsRepository: InMemoryCheckInsAttachmentsRepository
let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: FetchRecentCheckInsUseCase

describe('Fetch Recent Check-ins', () => {
  beforeEach(() => {
    inMemoryCheckInsAttachmentsRepository =
      new InMemoryCheckInsAttachmentsRepository()

    inMemoryCheckInsRepository = new InMemoryCheckInsRepository(
      inMemoryCheckInsAttachmentsRepository,
    )
    sut = new FetchRecentCheckInsUseCase(inMemoryCheckInsRepository)
  })

  it('should be able to fetch recent check-ins', async () => {
    const checkIn1 = makeCheckIn({
      parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      createdAt: new Date('2021-01-01'),
    })
    const checkIn2 = makeCheckIn({
      parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      createdAt: new Date('2021-01-02'),
    })
    const checkIn3 = makeCheckIn({
      parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
      createdAt: new Date('2021-01-03'),
    })
    const checkIn4 = makeCheckIn({
      parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
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
    expect(
      (result.value as { checkIns: CheckIn[] }).checkIns[0].id.toString(),
    ).toBe(checkIn4.id.toString())
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
