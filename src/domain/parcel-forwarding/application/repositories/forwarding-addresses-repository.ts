import { ParcelForwardingAddress } from '../../enterprise/entities/forwarding-address'

export abstract class ParcelForwardingAddressesRepository {
  abstract findByParcelForwardingId(
    parcelForwardingId: string,
  ): Promise<ParcelForwardingAddress | null>

  abstract findById(
    ParcelForwardingAddressId: string,
  ): Promise<ParcelForwardingAddress | null>

  abstract create(
    ParcelForwardingAddress: ParcelForwardingAddress,
  ): Promise<void>

  abstract save(ParcelForwardingAddress: ParcelForwardingAddress): Promise<void>

  abstract delete(
    ParcelForwardingAddress: ParcelForwardingAddress,
  ): Promise<void>
}
