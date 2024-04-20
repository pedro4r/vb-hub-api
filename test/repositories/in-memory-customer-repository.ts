import { CustomerRepository } from '@/domain/customer/application/repositories/customer-repository'
import { Customer } from '@/domain/customer/enterprise/entities/customer'
import { CustomerPreview } from '@/domain/customer/enterprise/entities/value-objects/customer-preview'

export class InMemoryCustomerRepository implements CustomerRepository {
  public items: Customer[] = []

  async findManyByName(name: string) {
    const lowerCaseName = name.toLowerCase()
    const customers = this.items.filter(
      (item) =>
        item.firstName.toLowerCase().includes(lowerCaseName) ||
        item.lastName.toLowerCase().includes(lowerCaseName),
    )

    return customers.map((customer) =>
      CustomerPreview.create({
        hubId: customer.hubId,
        parcelForwardingId: customer.parcelForwardingId,
        firstName: customer.firstName,
        lastName: customer.lastName,
        customerId: customer.id,
        createdAt: customer.createdAt,
      }),
    )
  }

  async findByHubId(hubId: number) {
    const customer = this.items.find((item) => item.hubId === hubId)

    if (!customer) {
      return null
    }

    return CustomerPreview.create({
      hubId: customer.hubId,
      parcelForwardingId: customer.parcelForwardingId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      customerId: customer.id,
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
