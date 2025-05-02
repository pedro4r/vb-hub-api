import { CustomerRepository } from '@/domain/customer/application/repositories/customer-repository'

import { Customer } from '@/domain/customer/enterprise/entities/customer'
import { CustomerDetails } from '@/domain/customer/enterprise/entities/value-objects/customer-details'
import { FetchCustomerByNameData } from '@/domain/customer/enterprise/entities/value-objects/fetch-customers-by-name-data'

export class InMemoryCustomerRepository implements CustomerRepository {
  public items: Customer[] = []

  async findManyByName(
    name: string,
    parcelForwardingId: string,
    page?: number,
  ) {
    const lowerCaseName = name.toLowerCase()
    const totalCustomers = this.items.filter(
      (item) =>
        item.parcelForwardingId.toString() === parcelForwardingId &&
        (item.firstName.toLowerCase().includes(lowerCaseName) ||
          item.lastName.toLowerCase().includes(lowerCaseName)),
    )

    const customers = totalCustomers.slice(
      ((page ?? 1) - 1) * 5,
      (page ?? 1) * 5,
    )

    return FetchCustomerByNameData.create({
      customers: customers.map((customer) =>
        CustomerDetails.create({
          hubId: customer.hubId,
          parcelForwardingId: customer.parcelForwardingId,
          firstName: customer.firstName,
          lastName: customer.lastName,
          phone: customer.phone,
          email: customer.email,
          customerId: customer.id,
          createdAt: customer.createdAt,
        }),
      ),
      meta: {
        pageIndex: page ?? 1,
        perPage: 5,
        totalCount: totalCustomers.length,
      },
    })
  }

  async findByHubId(hubId: number) {
    const customer = this.items.find((item) => item.hubId === hubId)

    if (!customer) {
      return null
    }

    return CustomerDetails.create({
      hubId: customer.hubId,
      parcelForwardingId: customer.parcelForwardingId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      customerId: customer.id,
      phone: customer.phone,
      email: customer.email,
      createdAt: customer.createdAt,
    })
  }

  async countParcelForwardingCustomers(parcelForwardingId: string) {
    return this.items.filter(
      (item) => item.parcelForwardingId.toString() === parcelForwardingId,
    ).length
  }

  async findById(id: string) {
    const customer = this.items.find((item) => item.id.toString() === id)

    if (!customer) {
      return null
    }

    return customer
  }

  async findByEmail(email: string) {
    const customer = this.items.find((item) => item.email === email)

    if (!customer) {
      return null
    }

    return customer
  }

  async create(customer: Customer) {
    this.items.push(customer)
  }
}
