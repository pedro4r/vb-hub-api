import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Customer,
  CustomerProps,
} from '@/domain/customer/enterprise/entities/customer'
import { PrismaCustomerMapper } from '@/infra/database/prisma/mappers/prisma-customer-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeCustomer(
  override: Partial<CustomerProps> = {},
  id?: UniqueEntityID,
) {
  const customer = Customer.create(
    {
      parcelForwardingId: new UniqueEntityID(),
      hubId: faker.number.int({ min: 1, max: 1000 }),
      firstName: faker.person.fullName(),
      lastName: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.number.int({ min: 1000000000, max: 9999999999 }).toString(), // 10 digits
      password: faker.internet.password(),
      createdAt: new Date(),
      ...override,
    },
    id,
  )

  return customer
}

@Injectable()
export class CustomerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCustomer(
    data: Partial<CustomerProps> = {},
  ): Promise<Customer> {
    const customer = makeCustomer(data)

    await this.prisma.customer.create({
      data: PrismaCustomerMapper.toPrisma(customer),
    })

    return customer
  }
}
