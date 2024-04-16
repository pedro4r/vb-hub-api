import { Customer } from '../../enterprise/entities/customer'
import { CustomerPreview } from '../../enterprise/entities/value-objects/customer-preview'

export abstract class CustomerRepository {
  abstract findByEmail(email: string): Promise<Customer | null>
  abstract findById(id: string): Promise<Customer | null>
  abstract findByCustomerCode(code: number): Promise<CustomerPreview | null>
  abstract create(customer: Customer): Promise<void>
  abstract countParcelForwardingCustomers(
    parcelForwardingId: string,
  ): Promise<number>
}
