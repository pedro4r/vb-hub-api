import { Field, ObjectType } from '@nestjs/graphql'

import { FilteredPackagesData } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/filtered-packages'
import { FilteredCheckInsData } from '@/domain/customer/enterprise/entities/value-objects/filtered-check-ins'
import { FilteredPackagesDataDTO } from '../package/filtered-packages-data-dto'
import { FilteredCheckInsDataDTO } from '../check-in/filtered-check-ins-data-dto'
import { FilteredCheckInAttachmentsDataDTO } from '../check-in/filtered-check-ins-attachments-data-dto'
import { FilteredCheckInAttachmentsData } from '@/domain/customer/enterprise/entities/value-objects/filtered-check-in-attachments'

@ObjectType()
export class CombinedFilterResponseDTO {
  @Field(() => FilteredPackagesDataDTO, { nullable: true })
  packagesData?: FilteredPackagesDataDTO

  @Field(() => FilteredCheckInsDataDTO, { nullable: true })
  checkInsData?: FilteredCheckInsDataDTO

  @Field(() => FilteredCheckInAttachmentsDataDTO, { nullable: true })
  checkInsDetailsData?: FilteredCheckInAttachmentsDataDTO

  static fromDomain(
    packagesData?: FilteredPackagesData,
    checkInsData?: FilteredCheckInsData,
    checkInsDetailsData?: FilteredCheckInAttachmentsData,
  ): CombinedFilterResponseDTO {
    return {
      packagesData: packagesData
        ? FilteredPackagesDataDTO.fromDomain(packagesData)
        : undefined,
      checkInsData: checkInsData
        ? FilteredCheckInsDataDTO.fromDomain(checkInsData)
        : undefined,
      checkInsDetailsData: checkInsDetailsData
        ? FilteredCheckInAttachmentsDataDTO.fromDomain(checkInsDetailsData)
        : undefined,
    }
  }
}
