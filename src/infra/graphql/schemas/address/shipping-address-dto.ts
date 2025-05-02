import { Field, ObjectType } from '@nestjs/graphql'
import { AddressDTO } from './address-dto'
import { ShippingAddress } from '@/domain/customer/enterprise/entities/shipping-address'
@ObjectType()
export class ShippingAddressDTO {
  @Field(() => String)
  customerId: string

  @Field(() => String)
  recipientName: string

  @Field(() => String, { nullable: true })
  taxId?: string

  @Field(() => AddressDTO)
  address: AddressDTO

  @Field(() => String, { nullable: true })
  phone?: string

  @Field(() => String, { nullable: true })
  email?: string

  @Field(() => String)
  createdAt: string

  @Field(() => String, { nullable: true })
  updatedAt?: string

  static fromDomain(
    shippingAddresses: ShippingAddress[],
  ): ShippingAddressDTO[] {
    const shippingAddressesDomainToDTO = shippingAddresses.map(
      (shippingAddress) => {
        return {
          customerId: shippingAddress.customerId.toString(),
          recipientName: shippingAddress.recipientName,
          taxId: shippingAddress.taxId ?? undefined,
          address: AddressDTO.fromDomain(shippingAddress.address),
          phone: shippingAddress.phone ?? undefined,
          email: shippingAddress.email ?? undefined,
          createdAt: shippingAddress.createdAt.toISOString(),
          updatedAt: shippingAddress.updatedAt
            ? shippingAddress.updatedAt.toISOString()
            : undefined,
        }
      },
    )

    return shippingAddressesDomainToDTO
  }
}
