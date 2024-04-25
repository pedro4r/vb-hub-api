import { CheckInDetails } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/check-in-details'
import { EnvService } from '@/infra/env/env.service'
import { Injectable } from '@nestjs/common'
@Injectable()
export class CheckInDetailsPresenter {
  constructor(private envService: EnvService) {}

  toHTTP(checkInDetails: CheckInDetails) {
    const r2DevURL = this.envService.get('CLOUDFLARE_DEV_URL')

    const attachments = checkInDetails.attachments.map(
      (attachment) => `${r2DevURL}/${attachment.url}`,
    )

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
      attachments,
      weight: checkInDetails.weight ?? null,
      createdAt: checkInDetails.createdAt,
      updatedAt: checkInDetails.updatedAt ?? null,
    }
  }
}
