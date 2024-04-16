import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { HubId } from './hub-id'

export interface CustomerPreviewProps {
  customerId: UniqueEntityID
  parcelForwardingId: UniqueEntityID
  hubId: HubId
  customerFirstName: string
  customerLastName: string
  createdAt: Date
}

export class CustomerPreview extends ValueObject<CustomerPreviewProps> {
  get hubId() {
    return this.props.hubId
  }

  get parcelForwardingId() {
    return this.props.parcelForwardingId
  }

  get customerFirstName() {
    return this.props.customerFirstName
  }

  get customerLastName() {
    return this.props.customerLastName
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
