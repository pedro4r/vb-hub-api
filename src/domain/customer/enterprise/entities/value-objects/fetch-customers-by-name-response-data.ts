import { ValueObject } from '@/core/entities/value-object'
import { CustomerPreview } from './customer-preview'

export interface FetchCustomersByNameResponseDataProps {
  customers: CustomerPreview[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export class FetchCustomerByNameResponseData extends ValueObject<FetchCustomersByNameResponseDataProps> {
  get customers() {
    return this.props.customers
  }

  get meta() {
    return this.props.meta
  }

  static create(props: FetchCustomersByNameResponseDataProps) {
    return new FetchCustomerByNameResponseData(props)
  }
}
