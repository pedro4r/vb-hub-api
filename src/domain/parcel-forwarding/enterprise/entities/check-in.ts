import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/opitional'
import { CheckInAttachmentList } from './check-in-attachment-list'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { CheckInCreatedEvent } from '../events/check-in-created-event'

export enum CheckInStatus {
  RECEIVED = 1,
  PENDING = 2,
  SHIPPED = 3,
  DELIVERED = 4,
  WITHDRAWN = 5,
  ABANDONED = 6,
  RETURNED = 7,
}

export interface CheckInProps {
  parcelForwardingId: UniqueEntityID
  customerId: UniqueEntityID
  details?: string | null
  status: CheckInStatus
  attachments: CheckInAttachmentList
  weight?: number | null
  createdAt: Date
  updatedAt?: Date | null
}

export class CheckIn extends AggregateRoot<CheckInProps> {
  get parcelForwardingId() {
    return this.props.parcelForwardingId
  }

  get customerId() {
    return this.props.customerId
  }

  get details() {
    if (!this.props.details) {
      return ''
    }
    return this.props.details
  }

  set details(details: string) {
    this.props.details = details
    this.touch()
  }

  get weight() {
    if (!this.props.weight) {
      return 0
    }
    return this.props.weight
  }

  get status() {
    return this.props.status
  }

  set status(status: CheckInStatus) {
    this.props.status = status
    this.touch()
  }

  get attachments() {
    return this.props.attachments
  }

  set attachments(attachments: CheckInAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<CheckInProps, 'createdAt' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const checkin = new CheckIn(
      {
        ...props,
        attachments: props.attachments ?? new CheckInAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isNewCheckIn = !id

    if (isNewCheckIn) {
      checkin.addDomainEvent(new CheckInCreatedEvent(checkin))
    }

    return checkin
  }
}
