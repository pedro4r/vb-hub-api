import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { CheckInAttachmentDetails } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/check-in-attachment-details'
import { CheckInPreview } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/check-in-preview'
import { PackageShippingAddress } from './package-shipping-address'
import { Package } from '../package'
import { Customer } from '../customer'
import { DeclarationModel } from '../declaration-model'

export interface CustomerDetailsProps {
  parcelForwardingId: UniqueEntityID
  customerInfo: Customer
  checkInsList: CheckInPreview[]
  checkInsAttachmentsDetails: CheckInAttachmentDetails[]
  packagesList: Package[]
  packageShippingAddresses: PackageShippingAddress[]
  declarationModels: DeclarationModel[]
}

export class CustomerDetails extends ValueObject<CustomerDetailsProps> {
  get parcelForwardingId() {
    return this.props.parcelForwardingId
  }

  get customerInfo() {
    return this.props.customerInfo.toCustomerInfo()
  }

  get checkInsList() {
    return this.props.checkInsList
  }

  get checkInsAttachmentsDetails() {
    return this.props.checkInsAttachmentsDetails
  }

  get packagesList() {
    return this.props.packagesList
  }

  get packageShippingAddresses() {
    return this.props.packageShippingAddresses
  }

  get declarationModels() {
    return this.props.declarationModels
  }

  static create(props: CustomerDetailsProps) {
    return new CustomerDetails(props)
  }
}
