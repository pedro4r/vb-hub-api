import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CustomerRepository } from '@/domain/customer/application/repositories/customer-repository'
import { Customer } from '@/domain/customer/enterprise/entities/customer'
import { CustomerPreview } from '@/domain/customer/enterprise/entities/value-objects/customer-preview'
import { PrismaCustomerMapper } from '../mappers/prisma-customer-mapper'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

@Injectable()
export class PrismaCustomerRepository implements CustomerRepository {
  constructor(private prisma: PrismaService) {}
  async findManyByName(name: string, page: number): Promise<CustomerPreview[]> {
    const customers = await this.prisma.customer.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: name,
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: name,
              mode: 'insensitive',
            },
          },
        ],
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    console.log(customers)

    return customers.map((customer) =>
      CustomerPreview.create({
        hubId: customer.hubId,
        parcelForwardingId: new UniqueEntityID(customer.parcelForwardingId),
        firstName: customer.firstName,
        lastName: customer.lastName,
        customerId: new UniqueEntityID(customer.id),
        createdAt: customer.createdAt,
      }),
    )
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: {
        email,
      },
    })

    return customer ? PrismaCustomerMapper.toDomain(customer) : null
  }

  async findById(id: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id,
      },
    })

    return customer ? PrismaCustomerMapper.toDomain(customer) : null
  }

  async findByHubId(hubId: number): Promise<CustomerPreview | null> {
    const customer = await this.prisma.customer.findUnique({
      where: {
        hubId,
      },
    })

    if (!customer) return null

    const customerPreview = CustomerPreview.create({
      customerId: new UniqueEntityID(customer.id),
      hubId: customer.hubId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      parcelForwardingId: new UniqueEntityID(customer.parcelForwardingId),
      createdAt: customer.createdAt,
    })

    return customerPreview
  }

  async create(customer: Customer): Promise<void> {
    const data = PrismaCustomerMapper.toPrisma(customer)

    await this.prisma.customer.create({
      data,
    })
  }

  async countParcelForwardingCustomers(
    parcelForwardingId: string,
  ): Promise<number> {
    return this.prisma.customer.count({
      where: {
        parcelForwardingId,
      },
    })
  }
}
