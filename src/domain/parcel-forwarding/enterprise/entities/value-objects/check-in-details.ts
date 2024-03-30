import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { Attachment } from '../attachment'

export interface CheckInDetailsProps {
  checkInId: UniqueEntityID
  parcelForwardingId: UniqueEntityID
  customerId: UniqueEntityID
  hubId: string
  customerName: string
  customerLastName: string
  packageId?: UniqueEntityID | null
  details?: string | null
  status: string
  attachments: Attachment[]
  weight?: number | null
  createdAt: Date
  updatedAt?: Date | null
}

export class CheckInDetails extends ValueObject<CheckInDetailsProps> {
  get checkInId() {
    return this.props.checkInId
  }

  get hubId() {
    return this.props.hubId
  }

  get customerName() {
    return this.props.customerName
  }

  get customerLastName() {
    return this.props.customerLastName
  }

  get parcelForwardingId() {
    return this.props.parcelForwardingId
  }

  get customerId() {
    return this.props.customerId
  }

  get packageId() {
    return this.props.packageId
  }

  get details() {
    if (!this.props.details) {
      return ''
    }
    return this.props.details
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

  get attachments() {
    return this.props.attachments
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: CheckInDetailsProps) {
    return new CheckInDetails(props)
  }
}
