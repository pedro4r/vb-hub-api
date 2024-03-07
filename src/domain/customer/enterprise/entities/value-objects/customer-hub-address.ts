import { ValueObject } from '@/core/entities/value-object'
import { HubId } from './hub-id'
import { ParcelForwardingAddress } from '@/domain/parcel-forwarding/enterprise/entities/forwarding-address'

export interface CustomerHubAddressProps {
  customerHubId: HubId
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
