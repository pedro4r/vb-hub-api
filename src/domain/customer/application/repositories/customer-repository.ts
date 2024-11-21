import { Customer } from '../../enterprise/entities/customer'
import { CustomerPreview } from '../../enterprise/entities/value-objects/customer-preview'
import { FetchCustomerByNameData } from '../../enterprise/entities/value-objects/fetch-customers-by-name-data'

export abstract class CustomerRepository {
  abstract findByEmail(email: string): Promise<Customer | null>
  abstract findManyByName(
    name: string,
    parcelForwardingId: string,
    page?: number,
  ): Promise<FetchCustomerByNameData>

  abstract findById(id: string): Promise<Customer | null>
  abstract findByHubId(hubId: number): Promise<CustomerPreview | null>
  abstract create(customer: Customer): Promise<void>
  abstract countParcelForwardingCustomers(
    parcelForwardingId: string,
  ): Promise<number>
}
