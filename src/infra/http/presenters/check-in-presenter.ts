import { CheckIn } from '@/domain/parcel-forwarding/enterprise/entities/check-in'

export class CheckInPresenter {
  static toHTTP(checkIn: CheckIn) {
    return {
      id: checkIn.id.toString(),
      status: checkIn.status,
      weight: checkIn.weight,
      customerId: checkIn.customerId,
      parcelForwardingId: checkIn.parcelForwardingId,
      createdAt: checkIn.createdAt,
    }
  }
}
