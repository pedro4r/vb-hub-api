import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { CheckInRepository } from '@/domain/parcel-forwarding/application/repositories/check-in-repository'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { CheckInCreatedEvent } from '@/domain/parcel-forwarding/enterprise/events/check-in-created-event'

export class OnCheckInCreated implements EventHandler {
  constructor(
    private checkInRepository: CheckInRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewCheckInNotification.bind(this),
      CheckInCreatedEvent.name,
    )
  }

  private async sendNewCheckInNotification({ checkIn }: CheckInCreatedEvent) {
    await this.sendNotification.execute({
      recipientId: checkIn.customerId.toString(),
      title: `Encomenda recebida ${checkIn.id.toString()}!`,
      content: `Veja as informações da sua encomenda`,
    })
  }
}
