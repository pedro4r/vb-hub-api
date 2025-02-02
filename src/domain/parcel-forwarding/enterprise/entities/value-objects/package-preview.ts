import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { PackageStatus } from '@/domain/customer/enterprise/entities/package'

export interface PackagePreviewProps {
  packageId: UniqueEntityID
  parcelForwardingId: UniqueEntityID
  customerId: UniqueEntityID
  hubId: number
  customerFirstName: string
  customerLastName: string
  weight?: number | null
  packageStatus: PackageStatus
  hasBattery: boolean
  trackingNumber?: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export class PackagePreview extends ValueObject<PackagePreviewProps> {
  get packageId() {
    return this.props.packageId
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

  get packageStatus() {
    return this.props.packageStatus
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

  static create(props: PackagePreviewProps) {
    return new PackagePreview(props)
  }
}
