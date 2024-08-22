"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
const entity_1 = require("../../../../core/entities/entity");
class Customer extends entity_1.Entity {
    get parcelForwardingId() {
        return this.props.parcelForwardingId;
    }
    get hubId() {
        return this.props.hubId;
    }
    get firstName() {
        return this.props.firstName;
    }
    set firstName(firstName) {
        this.props.firstName = firstName;
    }
    get lastName() {
        return this.props.lastName;
    }
    set lastName(lastName) {
        this.props.lastName = lastName;
    }
    get email() {
        return this.props.email;
    }
    set email(email) {
        this.props.email = email;
    }
    get password() {
        return this.props.password;
    }
    set password(password) {
        this.props.password = password;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    static create(props, id) {
        const customer = new Customer(props, id);
        return customer;
    }
}
exports.Customer = Customer;
//# sourceMappingURL=customer.js.map