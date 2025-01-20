import { FilteredCheckInAttachmentsData } from '@/domain/customer/enterprise/entities/value-objects/filtered-check-in-attachments'
import { EnvService } from '@/infra/env/env.service'
import { Injectable } from '@nestjs/common'
@Injectable()
export class CheckInAttachmentDetailsPresenter {
  constructor(private envService: EnvService) {}

  toHTTP(checkInsAttachmentData: FilteredCheckInAttachmentsData) {
    const checkInsAttachments = checkInsAttachmentData.checkInsAttachments.map(
      (checkInAttachment) => {
        const r2DevURL = this.envService.get('CLOUDFLARE_DEV_URL')

        const attachmentUrl = `${r2DevURL}/${checkInAttachment.attachment.url}`
        return {
          checkInId: checkInAttachment.checkInId.toString(),
          parcelForwardingId: checkInAttachment.parcelForwardingId.toString(),
          customerId: checkInAttachment.customerId.toString(),
          hubId: checkInAttachment.hubId,
          customerFirstName: checkInAttachment.customerFirstName,
          customerLastName: checkInAttachment.customerLastName,
          packageId: checkInAttachment.packageId
            ? checkInAttachment.packageId.toString()
            : null,
          details: checkInAttachment.details ?? null,
          status: checkInAttachment.status,
          attachmentUrl,
          weight: checkInAttachment.weight ?? null,
          createdAt: checkInAttachment.createdAt,
          updatedAt: checkInAttachment.updatedAt ?? null,
        }
      },
    )

    const checkInsAttachmentsDetails = {
      checkInsAttachments,
      meta: {
        pageIndex: checkInsAttachmentData.meta.pageIndex,
        perPage: checkInsAttachmentData.meta.perPage,
        totalCount: checkInsAttachmentData.meta.totalCount,
      },
    }

    return checkInsAttachmentsDetails
  }
}
