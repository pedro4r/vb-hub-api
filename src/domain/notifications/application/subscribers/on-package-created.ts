import { PackageRepository } from '@/domain/customer/application/repositories/package-repository'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { DomainEvents } from '@/core/events/domain-events'
import { PackageCreatedEvent } from '@/domain/customer/enterprise/events/package-created-event'
import { EventHandler } from '@/core/events/event-handler'

export class OnPackageCreated implements EventHandler {
  constructor(
    private packageRepository: PackageRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewPackageNotification.bind(this),
      PackageCreatedEvent.name,
    )
  }

  private async sendNewPackageNotification({ pkg }: PackageCreatedEvent) {
    await this.sendNotification.execute({
      recipientId: pkg.parcelForwardingId.toString(),
      title: `Requisicao de envio`,
      content: `Voce tem uma nova requisicao de envio de pacote!`,
    })
  }
}
