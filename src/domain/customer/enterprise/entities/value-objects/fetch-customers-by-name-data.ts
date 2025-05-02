import { ValueObject } from '@/core/entities/value-object'
import { CustomerDetails } from './customer-details'

export interface FetchCustomersByNameDataProps {
  customers: CustomerDetails[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export class FetchCustomerByNameData extends ValueObject<FetchCustomersByNameDataProps> {
  get customers() {
    return this.props.customers
  }

  get meta() {
    return this.props.meta
  }

  static create(props: FetchCustomersByNameDataProps) {
    return new FetchCustomerByNameData(props)
  }
}
