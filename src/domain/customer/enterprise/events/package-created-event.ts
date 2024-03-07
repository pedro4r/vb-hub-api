import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { Package } from '../entities/package'

export class PackageCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public pkg: Package

  constructor(pkg: Package) {
    this.pkg = pkg
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.pkg.id
  }
}
