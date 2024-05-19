import { FetchCustomersByNameDataProps } from '@/domain/customer/enterprise/entities/value-objects/fetch-customers-by-name-data'

export class CustomersPreviewPresenter {
  static toHTTP(customersData: FetchCustomersByNameDataProps) {
    const customers = customersData.customers.map((customer) => {
      return {
        hubId: customer.hubId,
        customerId: customer.customerId.toString(),
        parcelForwardingId: customer.parcelForwardingId.toString(),
        firstName: customer.firstName,
        lastName: customer.lastName,
        createdAt: customer.createdAt,
      }
    })

    const customersPreview = {
      customers,
      meta: {
        pageIndex: customersData.meta.pageIndex,
        perPage: customersData.meta.perPage,
        totalCount: customersData.meta.totalCount,
      },
    }

    return customersPreview
  }
}
