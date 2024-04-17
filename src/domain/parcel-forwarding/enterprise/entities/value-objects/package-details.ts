import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

import { PackageShippingAddress } from '@/domain/customer/enterprise/entities/package-shipping-address'

export interface PackageDetailsProps {
  packageId: UniqueEntityID
  parcelForwardingId: UniqueEntityID
  customerId: UniqueEntityID
  packageShippingAddress: PackageShippingAddress
  hubId: number
  customerFirstName: string
  customerLastName: string
  weight?: number | null
  hasBattery: boolean
  trackingNumber?: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export class PackageDetails extends ValueObject<PackageDetailsProps> {
  get packageId() {
    return this.props.packageId
  }

  get packageShippingAddress() {
    return this.props.packageShippingAddress
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

  get weight() {
    if (!this.props.weight) {
      return 0
    }
    return this.props.weight
  }

  get hasBattery() {
    return this.props.hasBattery
  }

  get trackingNumber() {
    return this.props.trackingNumber
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: PackageDetailsProps) {
    return new PackageDetails(props)
  }
}
