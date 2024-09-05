import { ParcelForwarding } from '../../enterprise/entities/parcel-forwarding'

export interface UpdatePasswordParams {
  email: string
  newPassword: string
}

export abstract class ParcelForwardingsRepository {
  abstract findByEmail(email: string): Promise<ParcelForwarding | null>
  abstract findById(id: string): Promise<ParcelForwarding | null>
  abstract create(parcelForwarding: ParcelForwarding): Promise<void>
  abstract updatePassword(data: UpdatePasswordParams): Promise<void>
}
