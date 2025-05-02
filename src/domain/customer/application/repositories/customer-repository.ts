import { Customer } from '../../enterprise/entities/customer'
import { CustomerDetails } from '../../enterprise/entities/value-objects/customer-details'
import { FetchCustomerByNameData } from '../../enterprise/entities/value-objects/fetch-customers-by-name-data'

export abstract class CustomerRepository {
  abstract findByEmail(email: string): Promise<Customer | null>
  abstract findManyByName(
    name: string,
    parcelForwardingId: string,
    page?: number,
  ): Promise<FetchCustomerByNameData>

  abstract findById(id: string): Promise<Customer | null>
  abstract findByHubId(hubId: number): Promise<CustomerDetails | null>

  abstract create(customer: Customer): Promise<void>
  abstract countParcelForwardingCustomers(
    parcelForwardingId: string,
  ): Promise<number>
}
