import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { FirstShippingAddressCreatedEvent } from '@/domain/customer/enterprise/events/first-address-created-event'
import { ShippingAddressRepository } from '@/domain/customer/application/repositories/shipping-address-repository'

export class OnFirstShippingAddressCreated implements EventHandler {
  constructor(
    private shippingAddressRepository: ShippingAddressRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendCustomerHubCreatedNotification.bind(this),
      FirstShippingAddressCreatedEvent.name,
    )
  }

  private async sendCustomerHubCreatedNotification({
    shippingAddress,
  }: FirstShippingAddressCreatedEvent) {
    await this.sendNotification.execute({
      recipientId: shippingAddress.customerId.toString(),
      title: `O endereço do seu Hub já foi criado!`,
      content: `Veja como usar o seu Hub!`,
    })
  }
}
