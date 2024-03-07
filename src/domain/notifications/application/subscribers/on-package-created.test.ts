import { SpyInstance } from 'vitest'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { waitFor } from 'test/utils/wait-for'
import { InMemoryPackageRepository } from 'test/repositories/in-memory-package-repository'
import { InMemoryCustomsDeclarationRepository } from 'test/repositories/in-memory-customs-declaration-repository'
import { OnPackageCreated } from './on-package-created'
import { makePackage } from 'test/factories/make-package'

let inMemoryPackageRepository: InMemoryPackageRepository
let inMemorycustomsDeclarationRepository: InMemoryCustomsDeclarationRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Check-in Created', () => {
  beforeEach(() => {
    inMemorycustomsDeclarationRepository =
      new InMemoryCustomsDeclarationRepository()
    inMemoryPackageRepository = new InMemoryPackageRepository(
      inMemorycustomsDeclarationRepository,
    )
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnPackageCreated(inMemoryPackageRepository, sendNotificationUseCase)
  })

  it('should send a notification when a package is created', async () => {
    const pkg = makePackage()

    inMemoryPackageRepository.create(pkg)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
