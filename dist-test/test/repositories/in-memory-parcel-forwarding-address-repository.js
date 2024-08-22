"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryParcelForwardingAddressesRepository = void 0;
class InMemoryParcelForwardingAddressesRepository {
    items = [];
    async findByParcelForwardingId(parcelForwardingId) {
        const parcelForwardingAddress = this.items.find((item) => item.parcelForwardingId.toString() === parcelForwardingId);
        if (!parcelForwardingAddress) {
            return null;
        }
        return parcelForwardingAddress;
    }
    async findById(parcelForwardingAddressId) {
        const parcelForwardingAddress = this.items.find((item) => item.id.toString() === parcelForwardingAddressId);
        if (!parcelForwardingAddress) {
            return null;
        }
        return parcelForwardingAddress;
    }
    async create(parcelForwardingAddressId) {
        this.items.push(parcelForwardingAddressId);
    }
    async save(parcelForwardingAddress) {
        const itemIndex = this.items.findIndex((item) => item.id === parcelForwardingAddress.id);
        this.items[itemIndex] = parcelForwardingAddress;
    }
    async delete(shipppingAddress) {
        const itemIndex = this.items.findIndex((item) => item.id.toString() === shipppingAddress.id.toString());
        this.items.splice(itemIndex, 1);
    }
}
exports.InMemoryParcelForwardingAddressesRepository = InMemoryParcelForwardingAddressesRepository;
//# sourceMappingURL=in-memory-parcel-forwarding-address-repository.js.map