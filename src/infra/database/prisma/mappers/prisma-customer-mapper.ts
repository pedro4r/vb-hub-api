import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Customer } from '@/domain/customer/enterprise/entities/customer'
import { Prisma, Customer as PrismaCustomer } from '@prisma/client'

export class PrismaCustomerMapper {
  static toDomain(raw: PrismaCustomer): Customer {
    return Customer.create(
      {
        firstName: raw.firstName,
        lastName: raw.lastName,
        hubId: raw.hubId,
        parcelForwardingId: new UniqueEntityID(raw.id),
        email: raw.email,
        password: raw.password,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(customer: Customer): Prisma.CustomerUncheckedCreateInput {
    return {
      id: customer.id.toString(),
      firstName: customer.firstName,
      lastName: customer.lastName,
      parcelForwardingId: customer.parcelForwardingId.toString(),
      hubId: customer.hubId,
      email: customer.email,
      password: customer.password,
    }
  }
}
