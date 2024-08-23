"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerPreview = void 0;
const value_object_1 = require("../../../../../core/entities/value-object");
class CustomerPreview extends value_object_1.ValueObject {
    get hubId() {
        return this.props.hubId;
    }
    get parcelForwardingId() {
        return this.props.parcelForwardingId;
    }
    get firstName() {
        return this.props.firstName;
    }
    get lastName() {
        return this.props.lastName;
    }
    get customerId() {
        return this.props.customerId;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    static create(props) {
        return new CustomerPreview(props);
    }
}
exports.CustomerPreview = CustomerPreview;
//# sourceMappingURL=customer-preview.js.map