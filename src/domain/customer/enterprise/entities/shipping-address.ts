import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/opitional'
import { Address } from '@/core/value-objects/address'
import { FirstShippingAddressCreatedEvent } from '../events/first-address-created-event'
import { AggregateRoot } from '@/core/entities/aggregate-root'

export interface ShippingAddressProps {
  customerId: UniqueEntityID
  recipientName: string
  taxId?: string | null
  address: Address
  phone?: string | null
  email?: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export class ShippingAddress extends AggregateRoot<ShippingAddressProps> {
  get customerId() {
    return this.props.customerId
  }

  get address() {
    return this.props.address
  }

  set address(address: Address) {
    this.props.address = address
    this.touch()
  }

  get phone() {
    return this.props.phone
  }

  set phone(phone: string | null | undefined) {
    this.props.phone = phone
    this.touch()
  }

  get email() {
    return this.props.email
  }

  set email(email: string | null | undefined) {
    this.props.email = email
    this.touch()
  }

  get taxId() {
    return this.props.taxId
  }

  set taxId(taxId: string | null | undefined) {
    this.props.taxId = taxId
    this.touch()
  }

  get recipientName() {
    return this.props.recipientName
  }

  set recipientName(recipientName: string) {
    this.props.recipientName = recipientName
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt ?? null
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<ShippingAddressProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const shippingAddress = new ShippingAddress(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isNewShippingAddress = !id

    if (isNewShippingAddress) {
      shippingAddress.addDomainEvent(
        new FirstShippingAddressCreatedEvent(shippingAddress),
      )
    }

    return shippingAddress
  }
}
