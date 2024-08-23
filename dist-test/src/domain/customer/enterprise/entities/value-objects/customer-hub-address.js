"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerHubAddress = void 0;
const value_object_1 = require("../../../../../core/entities/value-object");
class CustomerHubAddress extends value_object_1.ValueObject {
    get customerHubId() {
        return this.props.customerHubId;
    }
    get parcelForwardingAddress() {
        return this.props.parcelForwardingAddress;
    }
    static create(props) {
        return new CustomerHubAddress(props);
    }
}
exports.CustomerHubAddress = CustomerHubAddress;
//# sourceMappingURL=customer-hub-address.js.map