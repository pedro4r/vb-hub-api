import { Field, Int, ObjectType } from '@nestjs/graphql'
import { CustomerDetails } from '@/domain/customer/enterprise/entities/value-objects/customer-details'
@ObjectType()
export class CustomerDetailsDTO {
  @Field(() => String)
  customerId: string

  @Field(() => String)
  parcelForwardingId: string

  @Field(() => Int)
  hubId: number

  @Field(() => String)
  firstName: string

  @Field(() => String)
  lastName: string

  @Field(() => String)
  phone: string

  @Field(() => String)
  email: string

  @Field(() => String)
  createdAt: string

  static fromDomain(
    checkInAttachmentDetails: CustomerDetails,
  ): CustomerDetailsDTO {
    return {
      customerId: checkInAttachmentDetails.customerId.toString(),
      parcelForwardingId:
        checkInAttachmentDetails.parcelForwardingId.toString(),
      hubId: checkInAttachmentDetails.hubId,
      firstName: checkInAttachmentDetails.firstName,
      lastName: checkInAttachmentDetails.lastName,
      phone: checkInAttachmentDetails.phone,
      email: checkInAttachmentDetails.email,
      createdAt: checkInAttachmentDetails.createdAt.toISOString(),
    }
  }
}
