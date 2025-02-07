import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Meta } from '../meta/meta-data-dto'
import { CheckInStatus } from '@/domain/parcel-forwarding/enterprise/entities/check-in'
import { AttachmentDTO } from './attachment-dto'
import { CheckInAttachmentDetails } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/check-in-attachment-details'
import { FilteredCheckInAttachmentsData } from '@/domain/customer/enterprise/entities/value-objects/filtered-check-in-attachments'
@ObjectType()
export class CheckInAttachmentDetailsDTO {
  @Field(() => String)
  checkInId: string

  @Field(() => String)
  parcelForwardingId: string

  @Field(() => String)
  customerId: string

  @Field(() => Int)
  hubId: number

  @Field(() => String)
  customerFirstName: string

  @Field(() => String)
  customerLastName: string

  @Field(() => String, { nullable: true })
  packageId?: string

  @Field(() => String)
  status: string

  @Field(() => AttachmentDTO)
  attachment: AttachmentDTO

  @Field(() => Int, { nullable: true })
  weight?: number

  @Field(() => String)
  createdAt: string

  @Field(() => String, { nullable: true })
  updatedAt?: string

  static fromDomain(
    checkInAttachmentDetails: CheckInAttachmentDetails,
  ): CheckInAttachmentDetailsDTO {
    return {
      checkInId: checkInAttachmentDetails.checkInId.toString(),
      parcelForwardingId:
        checkInAttachmentDetails.parcelForwardingId.toString(),
      customerId: checkInAttachmentDetails.customerId.toString(),
      hubId: checkInAttachmentDetails.hubId,
      customerFirstName: checkInAttachmentDetails.customerFirstName,
      customerLastName: checkInAttachmentDetails.customerLastName,
      packageId: checkInAttachmentDetails.packageId?.toString(),
      attachment: AttachmentDTO.fromDomain(checkInAttachmentDetails.attachment),
      weight: checkInAttachmentDetails.weight,
      status: CheckInStatus[checkInAttachmentDetails.status],
      createdAt: checkInAttachmentDetails.createdAt.toISOString(),
      updatedAt: checkInAttachmentDetails.updatedAt?.toISOString(),
    }
  }
}

@ObjectType()
export class FilteredCheckInAttachmentsDataDTO {
  @Field(() => [CheckInAttachmentDetailsDTO])
  checkInsAttachments: CheckInAttachmentDetailsDTO[]

  @Field(() => Meta)
  meta: Meta

  static fromDomain(
    filteredCheckInAttachmentsData: FilteredCheckInAttachmentsData,
  ): FilteredCheckInAttachmentsDataDTO {
    return {
      checkInsAttachments:
        filteredCheckInAttachmentsData.checkInsAttachments.map(
          (checkInAttachment) => {
            return CheckInAttachmentDetailsDTO.fromDomain(checkInAttachment)
          },
        ),
      meta: filteredCheckInAttachmentsData.meta,
    }
  }
}
