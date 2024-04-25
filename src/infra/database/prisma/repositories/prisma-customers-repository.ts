import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CustomerRepository } from '@/domain/customer/application/repositories/customer-repository'
import { Customer } from '@/domain/customer/enterprise/entities/customer'
import { CustomerPreview } from '@/domain/customer/enterprise/entities/value-objects/customer-preview'
import { PrismaCustomerMapper } from '../mappers/prisma-customer-mapper'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchCustomerByNameResponseData } from '@/domain/customer/enterprise/entities/value-objects/fetch-customers-by-name-response-data'

@Injectable()
export class PrismaCustomerRepository implements CustomerRepository {
  constructor(private prisma: PrismaService) {}
  async findManyByName(
    name: string,
    parcelForwardingId: string,
    page: number,
  ): Promise<FetchCustomerByNameResponseData> {
    const totalCustomers = await this.prisma.customer.count({
      where: {
        parcelForwardingId,
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
    })

    const customers = await this.prisma.customer.findMany({
      where: {
        parcelForwardingId,
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
      take: 5,
      skip: (page - 1) * 5,
    })

    const customersToDomain = customers.map((customer) =>
      PrismaCustomerMapper.toDomain(customer),
    )

    return FetchCustomerByNameResponseData.create({
      customers: customersToDomain.map((customer) =>
        CustomerPreview.create({
          hubId: customer.hubId,
          parcelForwardingId: customer.parcelForwardingId,
          firstName: customer.firstName,
          lastName: customer.lastName,
          customerId: customer.id,
          createdAt: customer.createdAt,
        }),
      ),
      meta: {
        pageIndex: page,
        perPage: 5,
        totalCount: totalCustomers,
      },
    })
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
