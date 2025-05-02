import { Field, ObjectType } from '@nestjs/graphql'
import { Address } from '@/core/value-objects/address'
@ObjectType()
export class AddressDTO {
  @Field(() => String)
  address: string

  @Field(() => String, { nullable: true })
  complement?: string

  @Field(() => String)
  city: string

  @Field(() => String)
  state: string

  @Field(() => String)
  zipcode: string

  @Field(() => String)
  country: string

  static fromDomain(address: Address): AddressDTO {
    return {
      address: address.address,
      complement: address.complement ?? undefined,
      city: address.city,
      state: address.state,
      zipcode: address.zipcode,
      country: address.country,
    }
  }
}
