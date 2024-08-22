"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInPreview = void 0;
const value_object_1 = require("../../../../../core/entities/value-object");
class CheckInPreview extends value_object_1.ValueObject {
    get checkInId() {
        return this.props.checkInId;
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
    get packageId() {
        return this.props.packageId;
    }
    get weight() {
        if (!this.props.weight) {
            return 0;
        }
        return this.props.weight;
    }
    get status() {
        return this.props.status;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    static create(props) {
        return new CheckInPreview(props);
    }
}
exports.CheckInPreview = CheckInPreview;
//# sourceMappingURL=check-in-preview.js.map