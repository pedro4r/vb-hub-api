import { Field, ObjectType } from '@nestjs/graphql'

import { FilteredPackagesData } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/filtered-packages'
import { FilteredCheckInsData } from '@/domain/customer/enterprise/entities/value-objects/filtered-check-ins'
import { FilteredPackagesDataDTO } from '../package/filtered-packages-data-dto'
import { FilteredCheckInsDataDTO } from '../check-in/filtered-check-ins-data-dto'
import { FilteredCheckInAttachmentsDataDTO } from '../check-in/filtered-check-ins-attachments-data-dto'
import { FilteredCheckInAttachmentsData } from '@/domain/customer/enterprise/entities/value-objects/filtered-check-in-attachments'
import { CustomerDetailsDTO } from './customer-details-dto'
import { CustomerDetails } from '@/domain/customer/enterprise/entities/value-objects/customer-details'
import { ShippingAddressDTO } from '../address/shipping-address-dto'
import { ShippingAddress } from '@/domain/customer/enterprise/entities/shipping-address'
import { DeclarationModelDTO } from '../custom-declaration/declaration-model-dto'
import { DeclarationModel } from '@/domain/customer/enterprise/entities/declaration-model'

@ObjectType()
export class CombinedFilterResponseDTO {
  @Field(() => CustomerDetailsDTO, { nullable: true })
  customerDetails?: CustomerDetailsDTO

  @Field(() => FilteredPackagesDataDTO, { nullable: true })
  packagesData?: FilteredPackagesDataDTO

  @Field(() => FilteredCheckInsDataDTO, { nullable: true })
  checkInsData?: FilteredCheckInsDataDTO

  @Field(() => FilteredCheckInAttachmentsDataDTO, { nullable: true })
  checkInsDetailsData?: FilteredCheckInAttachmentsDataDTO

  @Field(() => [ShippingAddressDTO], { nullable: true })
  shippingAddressesList?: ShippingAddressDTO[]

  @Field(() => [DeclarationModelDTO], { nullable: true })
  declarationModelsList?: DeclarationModelDTO[]

  static fromDomain(
    customerDetails?: CustomerDetails,
    packagesData?: FilteredPackagesData,
    checkInsData?: FilteredCheckInsData,
    checkInsDetailsData?: FilteredCheckInAttachmentsData,
    shippingAddressesList?: ShippingAddress[],
    declarationModelsList?: DeclarationModel[],
  ): CombinedFilterResponseDTO {
    return {
      customerDetails: customerDetails
        ? CustomerDetailsDTO.fromDomain(customerDetails)
        : undefined,
      packagesData: packagesData
        ? FilteredPackagesDataDTO.fromDomain(packagesData)
        : undefined,
      checkInsData: checkInsData
        ? FilteredCheckInsDataDTO.fromDomain(checkInsData)
        : undefined,
      checkInsDetailsData: checkInsDetailsData
        ? FilteredCheckInAttachmentsDataDTO.fromDomain(checkInsDetailsData)
        : undefined,
      shippingAddressesList: shippingAddressesList
        ? ShippingAddressDTO.fromDomain(shippingAddressesList)
        : undefined,
      declarationModelsList: declarationModelsList
        ? DeclarationModelDTO.fromDomain(declarationModelsList)
        : undefined,
    }
  }
}
