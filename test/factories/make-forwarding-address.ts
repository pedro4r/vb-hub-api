import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  ParcelForwardingAddress,
  ParcelForwardingAddressProps,
} from '@/domain/parcel-forwarding/enterprise/entities/forwarding-address'
import { makeAddress } from './make-address'

export function makeParcelForwardingAddress(
  override: Partial<ParcelForwardingAddressProps> = {},
  id?: UniqueEntityID,
) {
  const parcelForwardingAddress = ParcelForwardingAddress.create(
    {
      parcelForwardingId: new UniqueEntityID(),
      address: makeAddress(),
      ...override,
    },
    id,
  )

  return parcelForwardingAddress
}
