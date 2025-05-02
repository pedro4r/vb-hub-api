import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface CustomerDetailsProps {
  customerId: UniqueEntityID
  parcelForwardingId: UniqueEntityID
  hubId: number
  firstName: string
  lastName: string
  phone: string
  email: string
  createdAt: Date
}

export class CustomerDetails extends ValueObject<CustomerDetailsProps> {
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

  get phone() {
    return this.props.phone
  }

  get email() {
    return this.props.email
  }

  get customerId() {
    return this.props.customerId
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(props: CustomerDetailsProps) {
    return new CustomerDetails(props)
  }
}
