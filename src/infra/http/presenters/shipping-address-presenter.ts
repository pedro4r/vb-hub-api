import { ShippingAddress } from '@/domain/customer/enterprise/entities/shipping-address'

export class ShippingAddressPresenter {
  static toHTTP(shippingAddress: ShippingAddress) {
    return {
      id: shippingAddress.id.toString(),
      recipientName: shippingAddress.recipientName,
      taxId: shippingAddress.taxId,
      phone: shippingAddress.phone,
      email: shippingAddress.email,
      address: shippingAddress.address.address,
      complement: shippingAddress.address.complement,
      city: shippingAddress.address.city,
      state: shippingAddress.address.state,
      zipcode: shippingAddress.address.zipcode,
      country: shippingAddress.address.country,
      createdAt: shippingAddress.createdAt,
    }
  }
}
