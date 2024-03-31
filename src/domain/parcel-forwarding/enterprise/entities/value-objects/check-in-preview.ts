import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface CheckInPreviewProps {
  checkInId: UniqueEntityID
  parcelForwardingId: UniqueEntityID
  customerId: UniqueEntityID
  hubId: string
  customerName: string
  customerLastName: string
  packageId?: UniqueEntityID | null
  status: string
  weight?: number | null
  createdAt: Date
  updatedAt?: Date | null
}

export class CheckInPreview extends ValueObject<CheckInPreviewProps> {
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

  get weight() {
    if (!this.props.weight) {
      return 0
    }
    return this.props.weight
  }

  get status() {
    return this.props.status
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: CheckInPreviewProps) {
    return new CheckInPreview(props)
  }
}
