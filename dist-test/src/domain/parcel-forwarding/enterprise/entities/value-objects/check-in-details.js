"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInDetails = void 0;
const value_object_1 = require("../../../../../core/entities/value-object");
class CheckInDetails extends value_object_1.ValueObject {
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
    get details() {
        if (!this.props.details) {
            return '';
        }
        return this.props.details;
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
    get attachments() {
        return this.props.attachments;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    static create(props) {
        return new CheckInDetails(props);
    }
}
exports.CheckInDetails = CheckInDetails;
//# sourceMappingURL=check-in-details.js.map