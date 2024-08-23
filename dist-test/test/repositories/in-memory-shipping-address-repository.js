"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryShippingAddressRepository = void 0;
const domain_events_1 = require("../../src/core/events/domain-events");
class InMemoryShippingAddressRepository {
    items = [];
    async findManyByCustomerId(customerId) {
        const shippingAddresses = this.items.filter((item) => item.customerId.toString() === customerId);
        return shippingAddresses;
    }
    async findById(shippingAddressId) {
        const address = this.items.find((item) => item.id.toString() === shippingAddressId);
        if (!address) {
            return null;
        }
        return address;
    }
    async create(shippingAddress) {
        this.items.push(shippingAddress);
        const shippingAddresses = this.items.filter((item) => item.customerId.toString() === shippingAddress.customerId.toString());
        if (shippingAddresses.length === 1) {
            domain_events_1.DomainEvents.dispatchEventsForAggregate(shippingAddress.id);
        }
    }
    async save(shippingAddress) {
        const itemIndex = this.items.findIndex((item) => item.id === shippingAddress.id);
        this.items[itemIndex] = shippingAddress;
    }
    async delete(shipppingAddress) {
        const itemIndex = this.items.findIndex((item) => item.id.toString() === shipppingAddress.id.toString());
        this.items.splice(itemIndex, 1);
    }
}
exports.InMemoryShippingAddressRepository = InMemoryShippingAddressRepository;
//# sourceMappingURL=in-memory-shipping-address-repository.js.map