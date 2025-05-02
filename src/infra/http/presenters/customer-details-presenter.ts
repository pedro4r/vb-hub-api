import { CustomerDetails } from '@/domain/customer/enterprise/entities/value-objects/customer-details'

export class CustomerDetailsPresenter {
  static toHTTP(customerDetails: CustomerDetails) {
    return {
      customerId: customerDetails.customerId.toString(),
      hubId: customerDetails.hubId,
      firstName: customerDetails.firstName,
      lastName: customerDetails.lastName,
      email: customerDetails.email,
      phone: customerDetails.phone,
      createdAt: customerDetails.createdAt,
    }
  }
}
