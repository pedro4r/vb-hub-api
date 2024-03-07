import { InMemoryCheckInsRepository } from 'test/repositories/in-memory-check-ins-repository'
import { SpyInstance } from 'vitest'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { InMemoryCheckInsAttachmentsRepository } from 'test/repositories/in-memory-check-ins-attachments-repository'
import { OnCheckInCreated } from './on-check-in-created'
import { makeCheckIn } from 'test/factories/make-check-in'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { waitFor } from 'test/utils/wait-for'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let inMemoryCheckInsAttachmentsRepository: InMemoryCheckInsAttachmentsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Check-in Created', () => {
  beforeEach(() => {
    inMemoryCheckInsAttachmentsRepository =
      new InMemoryCheckInsAttachmentsRepository()
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository(
      inMemoryCheckInsAttachmentsRepository,
    )

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnCheckInCreated(inMemoryCheckInsRepository, sendNotificationUseCase)
  })

  it('should send a notification when a check-in is created', async () => {
    const checkIn = makeCheckIn({
      parcelForwardingId: new UniqueEntityID('company-1'),
      customerId: new UniqueEntityID('customer-1'),
    })

    inMemoryCheckInsRepository.create(checkIn)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
