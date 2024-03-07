import { CustomerRepository } from '@/domain/customer/application/repositories/customer-repository'
import { Customer } from '@/domain/customer/enterprise/entities/customer'

export class InMemoryCustomerRepository implements CustomerRepository {
  public items: Customer[] = []

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
