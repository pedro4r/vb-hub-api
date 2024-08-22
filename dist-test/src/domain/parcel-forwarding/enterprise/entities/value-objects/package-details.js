"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageDetails = void 0;
const value_object_1 = require("../../../../../core/entities/value-object");
class PackageDetails extends value_object_1.ValueObject {
    get packageId() {
        return this.props.packageId;
    }
    get packageShippingAddress() {
        return this.props.packageShippingAddress;
    }
    get hubId() {
        return this.props.hubId;
    }
    get customerFirstName() {
        return this.props.customerFirstName;
    }
    get customerLastName() {
        return this.props.customerLastName;
    }
    get parcelForwardingId() {
        return this.props.parcelForwardingId;
    }
    get customerId() {
        return this.props.customerId;
    }
    get weight() {
        if (!this.props.weight) {
            return 0;
        }
        return this.props.weight;
    }
    get hasBattery() {
        return this.props.hasBattery;
    }
    get trackingNumber() {
        return this.props.trackingNumber;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    static create(props) {
        return new PackageDetails(props);
    }
}
exports.PackageDetails = PackageDetails;
//# sourceMappingURL=package-details.js.map