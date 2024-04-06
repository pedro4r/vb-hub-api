import { CheckInDetails } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/check-in-details'
import { AttachmentPresenter } from './attachment-presenter'

export class CheckInDetailsPresenter {
  static toHTTP(checkInDetails: CheckInDetails) {
    return {
      checkInId: checkInDetails.checkInId.toString(),
      parcelForwardingId: checkInDetails.parcelForwardingId.toString(),
      customerId: checkInDetails.customerId.toString(),
      hubId: checkInDetails.hubId,
      customerFirstName: checkInDetails.customerFirstName,
      customerLastName: checkInDetails.customerLastName,
      packageId: checkInDetails.packageId
        ? checkInDetails.packageId.toString()
        : null,
      details: checkInDetails.details ?? null,
      status: checkInDetails.status,
      attachments: checkInDetails.attachments.map(AttachmentPresenter.toHTTP),
      weight: checkInDetails.weight ?? null,
      createdAt: checkInDetails.createdAt,
      updatedAt: checkInDetails.updatedAt ?? null,
    }
  }
}
