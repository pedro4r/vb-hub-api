import { FilteredCheckInsData } from '@/domain/customer/enterprise/entities/value-objects/filtered-check-ins'
import { CheckInPreview } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/check-in-preview'
import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Meta } from '../meta/meta-data-dto'
import { CheckInStatus } from '@/domain/parcel-forwarding/enterprise/entities/check-in'

@ObjectType()
export class CheckInPreviewDTO {
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

  @Field(() => Int, { nullable: true })
  weight?: number

  @Field(() => String)
  createdAt: string

  @Field(() => String, { nullable: true })
  updatedAt?: string

  static fromDomain(checkInPreview: CheckInPreview): CheckInPreviewDTO {
    return {
      checkInId: checkInPreview.checkInId.toString(),
      parcelForwardingId: checkInPreview.parcelForwardingId.toString(),
      customerId: checkInPreview.customerId.toString(),
      hubId: checkInPreview.hubId,
      customerFirstName: checkInPreview.customerFirstName,
      customerLastName: checkInPreview.customerLastName,
      packageId: checkInPreview.packageId?.toString(),
      weight: checkInPreview.weight,
      status: CheckInStatus[checkInPreview.status],
      createdAt: checkInPreview.createdAt.toISOString(),
      updatedAt: checkInPreview.updatedAt?.toISOString(),
    }
  }
}

@ObjectType()
export class FilteredCheckInsDataDTO {
  @Field(() => [CheckInPreviewDTO])
  checkIns: CheckInPreviewDTO[]

  @Field(() => Meta)
  meta: Meta

  static fromDomain(
    filteredCheckInsData: FilteredCheckInsData,
  ): FilteredCheckInsDataDTO {
    return {
      checkIns: filteredCheckInsData.checkIns.map(CheckInPreviewDTO.fromDomain),
      meta: filteredCheckInsData.meta,
    }
  }
}
