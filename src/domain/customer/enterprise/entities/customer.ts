import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Entity } from '@/core/entities/entity'

export interface CustomerProps {
  parcelForwardingId: UniqueEntityID
  hubId: number
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  createdAt: Date
}

export class Customer extends Entity<CustomerProps> {
  get parcelForwardingId() {
    return this.props.parcelForwardingId
  }

  get hubId() {
    return this.props.hubId
  }

  get firstName() {
    return this.props.firstName
  }

  set firstName(firstName: string) {
    this.props.firstName = firstName
  }

  get lastName() {
    return this.props.lastName
  }

  set lastName(lastName: string) {
    this.props.lastName = lastName
  }

  get email() {
    return this.props.email
  }

  set email(email: string) {
    this.props.email = email
  }

  get phone() {
    return this.props.phone
  }

  set phone(phone: string) {
    this.props.phone = phone
  }

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(props: CustomerProps, id?: UniqueEntityID) {
    const customer = new Customer(props, id)

    return customer
  }

  toCustomerInfo(): Omit<CustomerProps, 'password'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...customerInfo } = this.props
    return customerInfo
  }
}
