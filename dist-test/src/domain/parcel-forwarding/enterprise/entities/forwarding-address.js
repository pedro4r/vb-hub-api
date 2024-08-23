"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelForwardingAddress = void 0;
const entity_1 = require("../../../../core/entities/entity");
class ParcelForwardingAddress extends entity_1.Entity {
    get parcelForwardingId() {
        return this.props.parcelForwardingId;
    }
    get address() {
        return this.props.address;
    }
    set address(address) {
        this.props.address = address;
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
        const parcelForwardingAddress = new ParcelForwardingAddress({
            ...props,
            createdAt: props.createdAt ?? new Date(),
        }, id);
        return parcelForwardingAddress;
    }
}
exports.ParcelForwardingAddress = ParcelForwardingAddress;
//# sourceMappingURL=forwarding-address.js.map