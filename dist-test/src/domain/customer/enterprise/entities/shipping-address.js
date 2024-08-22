"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingAddress = void 0;
const first_address_created_event_1 = require("../events/first-address-created-event");
const aggregate_root_1 = require("../../../../core/entities/aggregate-root");
class ShippingAddress extends aggregate_root_1.AggregateRoot {
    get customerId() {
        return this.props.customerId;
    }
    get address() {
        return this.props.address;
    }
    set address(address) {
        this.props.address = address;
        this.touch();
    }
    get phoneNumber() {
        return this.props.phoneNumber;
    }
    set phoneNumber(phoneNumber) {
        this.props.phoneNumber = phoneNumber;
        this.touch();
    }
    get email() {
        return this.props.email;
    }
    set email(email) {
        this.props.email = email;
        this.touch();
    }
    get taxId() {
        return this.props.taxId;
    }
    set taxId(taxId) {
        this.props.taxId = taxId;
        this.touch();
    }
    get recipientName() {
        return this.props.recipientName;
    }
    set recipientName(recipientName) {
        this.props.recipientName = recipientName;
        this.touch();
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt ?? null;
    }
    touch() {
        this.props.updatedAt = new Date();
    }
    static create(props, id) {
        const shippingAddress = new ShippingAddress({
            ...props,
            createdAt: props.createdAt ?? new Date(),
        }, id);
        const isNewShippingAddress = !id;
        if (isNewShippingAddress) {
            shippingAddress.addDomainEvent(new first_address_created_event_1.FirstShippingAddressCreatedEvent(shippingAddress));
        }
        return shippingAddress;
    }
}
exports.ShippingAddress = ShippingAddress;
//# sourceMappingURL=shipping-address.js.map