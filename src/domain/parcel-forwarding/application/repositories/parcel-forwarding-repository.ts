import { ParcelForwarding } from '../../enterprise/entities/parcel-forwarding'

export abstract class ParcelForwardingRepository {
  abstract findByEmail(email: string): Promise<ParcelForwarding | null>
  abstract findById(id: string): Promise<ParcelForwarding | null>
  abstract create(parcelForwarding: ParcelForwarding): Promise<void>
}
