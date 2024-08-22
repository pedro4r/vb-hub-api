"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirstShippingAddressCreatedEvent = void 0;
class FirstShippingAddressCreatedEvent {
    ocurredAt;
    shippingAddress;
    constructor(shippingAddress) {
        this.shippingAddress = shippingAddress;
        this.ocurredAt = new Date();
    }
    getAggregateId() {
        return this.shippingAddress.id;
    }
}
exports.FirstShippingAddressCreatedEvent = FirstShippingAddressCreatedEvent;
//# sourceMappingURL=first-address-created-event.js.map