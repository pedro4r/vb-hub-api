import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface CustomerPreviewProps {
  customerId: UniqueEntityID
  parcelForwardingId: UniqueEntityID
  hubId: number
  firstName: string
  lastName: string
  createdAt: Date
}

export class CustomerPreview extends ValueObject<CustomerPreviewProps> {
  get hubId() {
    return this.props.hubId
  }

  get parcelForwardingId() {
    return this.props.parcelForwardingId
  }

  get firstName() {
    return this.props.firstName
  }

  get lastName() {
    return this.props.lastName
  }

  get customerId() {
    return this.props.customerId
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(props: CustomerPreviewProps) {
    return new CustomerPreview(props)
  }
}
