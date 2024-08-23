"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryPackageShippingAddressRepository = void 0;
const resource_not_found_error_1 = require("../../src/core/errors/errors/resource-not-found-error");
const unique_entity_id_1 = require("../../src/core/entities/unique-entity-id");
const package_shipping_address_1 = require("../../src/domain/customer/enterprise/entities/package-shipping-address");
class InMemoryPackageShippingAddressRepository {
    shippingAddressRepository;
    items = [];
    constructor(shippingAddressRepository) {
        this.shippingAddressRepository = shippingAddressRepository;
    }
    async findById(id) {
        const packageShippingAddress = this.items.find((item) => item.id.toString() === id);
        if (!packageShippingAddress) {
            return null;
        }
        return packageShippingAddress;
    }
    async create(shippingAddressId) {
        const shippingAddress = await this.shippingAddressRepository.findById(shippingAddressId);
        if (!shippingAddress) {
            throw new resource_not_found_error_1.ResourceNotFoundError('Shipping Address not found');
        }
        const packageShippingAddress = package_shipping_address_1.PackageShippingAddress.create({
            recipientName: shippingAddress.recipientName,
            address: shippingAddress.address,
            createdAt: new Date(),
        }, new unique_entity_id_1.UniqueEntityID(shippingAddressId));
        this.items.push(packageShippingAddress);
    }
    async delete(shippingAddressId) {
        const itemIndex = this.items.findIndex((item) => item.id.toString() === shippingAddressId);
        this.items.splice(itemIndex, 1);
    }
}
exports.InMemoryPackageShippingAddressRepository = InMemoryPackageShippingAddressRepository;
//# sourceMappingURL=in-memory-package-shipping-address-repository.js.map