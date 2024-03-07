import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { ShippingAddress } from '../entities/shipping-address'

export class FirstShippingAddressCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public shippingAddress: ShippingAddress

  constructor(shippingAddress: ShippingAddress) {
    this.shippingAddress = shippingAddress
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.shippingAddress.id
  }
}
