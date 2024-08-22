"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageShippingAddress = void 0;
const entity_1 = require("../../../../core/entities/entity");
class PackageShippingAddress extends entity_1.Entity {
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
        const shippingAddress = new PackageShippingAddress({
            ...props,
            createdAt: props.createdAt ?? new Date(),
        }, id);
        return shippingAddress;
    }
}
exports.PackageShippingAddress = PackageShippingAddress;
//# sourceMappingURL=package-shipping-address.js.map