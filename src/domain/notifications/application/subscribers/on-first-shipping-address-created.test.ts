import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { InMemoryShippingAddressRepository } from 'test/repositories/in-memory-shipping-address-repository'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { SpyInstance } from 'vitest'
import { OnFirstShippingAddressCreated } from './on-first-shipping-address-created'
import { makeShippingAddress } from 'test/factories/make-shipping-address'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { waitFor } from 'test/utils/wait-for'

let inMemoryShippingAddressRepository: InMemoryShippingAddressRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On First Shipping Address Created', () => {
  beforeEach(() => {
    inMemoryShippingAddressRepository = new InMemoryShippingAddressRepository()

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnFirstShippingAddressCreated(
      inMemoryShippingAddressRepository,
      sendNotificationUseCase,
    )
  })

  it('should send a notification when a check-in is created', async () => {
    const shippingAddress = makeShippingAddress({
      customerId: new UniqueEntityID('customer-1'),
    })

    inMemoryShippingAddressRepository.create(shippingAddress)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
