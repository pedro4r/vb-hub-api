import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Customer } from '@/domain/customer/enterprise/entities/customer'
import { HubId } from '@/domain/customer/enterprise/entities/value-objects/hub-id'
import { Prisma, Customer as PrismaCustomer } from '@prisma/client'

export class PrismaCustomerMapper {
  static toDomain(raw: PrismaCustomer): Customer {
    const [parcelForwadingInitials, customerCode] = raw.hubId.split('-')
    return Customer.create(
      {
        name: raw.name,
        hubId: HubId.create({
          parcelForwadingInitials,
          customerCode: parseInt(customerCode),
        }),
        parcelForwardingId: new UniqueEntityID(raw.id),
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(customer: Customer): Prisma.CustomerUncheckedCreateInput {
    return {
      id: customer.id.toString(),
      name: customer.name,
      parcelForwardingId: customer.parcelForwardingId.toString(),
      hubId: `${customer.hubId.parcelForwadingInitials}-${customer.hubId.customerCode}`,
      email: customer.email,
      password: customer.password,
    }
  }
}
