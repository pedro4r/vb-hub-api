import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/opitional'
import { Address } from '@/core/value-objects/address'
import { Entity } from '@/core/entities/entity'

export interface PackageShippingAddressProps {
  recipientName: string
  taxId?: string | null
  address: Address
  phoneNumber?: string | null
  email?: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export class PackageShippingAddress extends Entity<PackageShippingAddressProps> {
  get address() {
    return this.props.address
  }

  set address(address: Address) {
    this.props.address = address
    this.touch()
  }

  get phoneNumber() {
    return this.props.phoneNumber
  }

  set phoneNumber(phoneNumber: string | null | undefined) {
    this.props.phoneNumber = phoneNumber
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
    props: Optional<PackageShippingAddressProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const shippingAddress = new PackageShippingAddress(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return shippingAddress
  }
}
