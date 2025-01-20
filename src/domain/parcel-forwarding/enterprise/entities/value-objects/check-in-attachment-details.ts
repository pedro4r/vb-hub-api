import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { Attachment } from '../attachment'

export interface CheckInAttachmentDetailsProps {
  checkInId: UniqueEntityID
  parcelForwardingId: UniqueEntityID
  customerId: UniqueEntityID
  hubId: number
  customerFirstName: string
  customerLastName: string
  packageId?: UniqueEntityID | null
  details?: string | null
  status: string
  attachment: Attachment
  weight?: number | null
  createdAt: Date
  updatedAt?: Date | null
}

export class CheckInAttachmentDetails extends ValueObject<CheckInAttachmentDetailsProps> {
  get checkInId() {
    return this.props.checkInId
  }

  get hubId() {
    return this.props.hubId
  }

  get customerFirstName() {
    return this.props.customerFirstName
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

  get attachment() {
    return this.props.attachment
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: CheckInAttachmentDetailsProps) {
    return new CheckInAttachmentDetails(props)
  }
}
