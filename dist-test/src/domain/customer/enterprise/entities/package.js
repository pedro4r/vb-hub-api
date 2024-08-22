"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Package = void 0;
const aggregate_root_1 = require("../../../../core/entities/aggregate-root");
const package_created_event_1 = require("../events/package-created-event");
const customs_declaration_list_1 = require("./customs-declaration-list");
const package_check_ins_list_1 = require("./package-check-ins-list");
class Package extends aggregate_root_1.AggregateRoot {
    get customerId() {
        return this.props.customerId;
    }
    get parcelForwardingId() {
        return this.props.parcelForwardingId;
    }
    get shippingAddressId() {
        return this.props.shippingAddressId;
    }
    set shippingAddressId(id) {
        this.props.shippingAddressId = id;
        this.touch();
    }
    get checkIns() {
        return this.props.checkIns;
    }
    set checkIns(checkIns) {
        this.props.checkIns = checkIns;
        this.touch();
    }
    get customsDeclarationList() {
        return this.props.customsDeclarationList;
    }
    set customsDeclarationList(customsDeclarationList) {
        this.props.customsDeclarationList = customsDeclarationList;
        this.touch();
    }
    get weight() {
        return this.props.weight;
    }
    set weight(weight) {
        this.props.weight = weight;
        this.touch();
    }
    get hasBattery() {
        return this.props.hasBattery;
    }
    set hasBattery(hasBattery) {
        this.props.hasBattery = hasBattery;
        this.touch();
    }
    get trackingNumber() {
        return this.props.trackingNumber;
    }
    set trackingNumber(trackingNumber) {
        this.props.trackingNumber = trackingNumber;
        this.touch();
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    touch() {
        this.props.updatedAt = new Date();
    }
    static create(props, id) {
        const pkg = new Package({
            ...props,
            checkIns: props.checkIns ?? new package_check_ins_list_1.PackageCheckInsList(),
            customsDeclarationList: props.customsDeclarationList ?? new customs_declaration_list_1.CustomsDeclarationList(),
            createdAt: props.createdAt ?? new Date(),
        }, id);
        const isNewPackage = !id;
        if (isNewPackage) {
            pkg.addDomainEvent(new package_created_event_1.PackageCreatedEvent(pkg));
        }
        return pkg;
    }
}
exports.Package = Package;
//# sourceMappingURL=package.js.map