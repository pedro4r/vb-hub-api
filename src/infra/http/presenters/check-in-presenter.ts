import { CheckInPreview } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/check-in-preview'

export class CheckInPresenter {
  static toHTTP(checkInPreview: CheckInPreview) {
    return {
      checkInId: checkInPreview.checkInId.toString(),
      parcelForwardingId: checkInPreview.parcelForwardingId.toString(),
      customerId: checkInPreview.customerId.toString(),
      hubId: checkInPreview.hubId,
      customerName: checkInPreview.customerName,
      customerLastName: checkInPreview.customerLastName,
      packageId: checkInPreview.packageId?.toString() || null,
      status: checkInPreview.status,
      weight: checkInPreview.weight || null,
      createdAt: checkInPreview.createdAt,
      updatedAt: checkInPreview.updatedAt || null,
    }
  }
}
