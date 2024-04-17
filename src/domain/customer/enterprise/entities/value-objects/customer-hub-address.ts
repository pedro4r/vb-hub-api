import { ValueObject } from '@/core/entities/value-object'
import { ParcelForwardingAddress } from '@/domain/parcel-forwarding/enterprise/entities/forwarding-address'

export interface CustomerHubAddressProps {
  customerHubId: number
  parcelForwardingAddress: ParcelForwardingAddress
}

export class CustomerHubAddress extends ValueObject<CustomerHubAddressProps> {
  get customerHubId() {
    return this.props.customerHubId
  }

  get parcelForwardingAddress() {
    return this.props.parcelForwardingAddress
  }

  static create(props: CustomerHubAddressProps) {
    return new CustomerHubAddress(props)
  }
}
