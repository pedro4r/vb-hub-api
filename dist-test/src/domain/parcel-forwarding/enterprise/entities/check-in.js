"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckIn = exports.CheckInStatus = void 0;
const check_in_attachment_list_1 = require("./check-in-attachment-list");
const aggregate_root_1 = require("../../../../core/entities/aggregate-root");
const check_in_created_event_1 = require("../events/check-in-created-event");
var CheckInStatus;
(function (CheckInStatus) {
    CheckInStatus[CheckInStatus["RECEIVED"] = 1] = "RECEIVED";
    CheckInStatus[CheckInStatus["PENDING"] = 2] = "PENDING";
    CheckInStatus[CheckInStatus["SHIPPED"] = 3] = "SHIPPED";
    CheckInStatus[CheckInStatus["DELIVERED"] = 4] = "DELIVERED";
    CheckInStatus[CheckInStatus["WITHDRAWN"] = 5] = "WITHDRAWN";
    CheckInStatus[CheckInStatus["ABANDONED"] = 6] = "ABANDONED";
    CheckInStatus[CheckInStatus["RETURNED"] = 7] = "RETURNED";
})(CheckInStatus || (exports.CheckInStatus = CheckInStatus = {}));
class CheckIn extends aggregate_root_1.AggregateRoot {
    get parcelForwardingId() {
        return this.props.parcelForwardingId;
    }
    get customerId() {
        return this.props.customerId;
    }
    get packageId() {
        return this.props.packageId;
    }
    set packageId(packageId) {
        this.props.packageId = packageId;
        this.touch();
    }
    get details() {
        if (!this.props.details) {
            return '';
        }
        return this.props.details;
    }
    set details(details) {
        this.props.details = details;
        this.touch();
    }
    get weight() {
        if (!this.props.weight) {
            return 0;
        }
        return this.props.weight;
    }
    set weight(weight) {
        this.props.weight = weight;
        this.touch();
    }
    get status() {
        return CheckInStatus[this.props.status];
    }
    getStatusAsCode() {
        return this.props.status;
    }
    set status(status) {
        this.props.status = status;
        this.touch();
    }
    get attachments() {
        return this.props.attachments;
    }
    set attachments(attachments) {
        this.props.attachments = attachments;
        this.touch();
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    touch() {
        this.props.updatedAt = new Date();
    }
    static create(props, id) {
        const checkin = new CheckIn({
            ...props,
            attachments: props.attachments ?? new check_in_attachment_list_1.CheckInAttachmentList(),
            createdAt: props.createdAt ?? new Date(),
        }, id);
        const isNewCheckIn = !id;
        if (isNewCheckIn) {
            checkin.addDomainEvent(new check_in_created_event_1.CheckInCreatedEvent(checkin));
        }
        return checkin;
    }
}
exports.CheckIn = CheckIn;
//# sourceMappingURL=check-in.js.map