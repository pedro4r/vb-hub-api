import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { CheckIn } from '../entities/check-in'

export class CheckInCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public checkIn: CheckIn

  constructor(checkIn: CheckIn) {
    this.checkIn = checkIn
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.checkIn.id
  }
}
