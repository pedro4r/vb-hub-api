"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingAddressPresenter = void 0;
class ShippingAddressPresenter {
    static toHTTP(shippingAddress) {
        return {
            id: shippingAddress.id.toString(),
            recipientName: shippingAddress.recipientName,
            taxId: shippingAddress.taxId,
            phoneNumber: shippingAddress.phoneNumber,
            email: shippingAddress.email,
            address: shippingAddress.address.address,
            complement: shippingAddress.address.complement,
            city: shippingAddress.address.city,
            state: shippingAddress.address.state,
            zipcode: shippingAddress.address.zipcode,
            country: shippingAddress.address.country,
            createdAt: shippingAddress.createdAt,
        };
    }
}
exports.ShippingAddressPresenter = ShippingAddressPresenter;
//# sourceMappingURL=shipping-address-presenter.js.map