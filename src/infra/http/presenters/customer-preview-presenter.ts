import { CustomerPreview } from '@/domain/customer/enterprise/entities/value-objects/customer-preview'

export class CustomerPreviewPresenter {
  static toHTTP(customerPreview: CustomerPreview) {
    return {
      customerId: customerPreview.customerId.toString(),
      hubId: customerPreview.hubId,
      firstName: customerPreview.firstName,
      lastName: customerPreview.lastName,
    }
  }
}
