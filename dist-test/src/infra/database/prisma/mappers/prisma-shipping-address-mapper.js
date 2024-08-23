"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaShippingAddressMapper = void 0;
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const address_1 = require("../../../../core/value-objects/address");
const shipping_address_1 = require("../../../../domain/customer/enterprise/entities/shipping-address");
class PrismaShippingAddressMapper {
    static toDomain(raw) {
        const address = address_1.Address.create({
            address: raw.address,
            complement: raw.complement,
            city: raw.city,
            state: raw.state,
            zipcode: raw.zipcode,
            country: raw.country,
        });
        return shipping_address_1.ShippingAddress.create({
            customerId: new unique_entity_id_1.UniqueEntityID(raw.customerId),
            recipientName: raw.recipientName,
            taxId: raw.taxId ?? null,
            email: raw.email ?? null,
            phoneNumber: raw.phoneNumber ?? null,
            address,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        }, new unique_entity_id_1.UniqueEntityID(raw.id));
    }
    static toPrisma(shippingAddress) {
        return {
            id: shippingAddress.id.toString(),
            customerId: shippingAddress.customerId.toString(),
            recipientName: shippingAddress.recipientName,
            taxId: shippingAddress.taxId ?? null,
            email: shippingAddress.email ?? null,
            phoneNumber: shippingAddress.phoneNumber ?? null,
            address: shippingAddress.address.address,
            complement: shippingAddress.address.complement ?? null,
            city: shippingAddress.address.city,
            state: shippingAddress.address.state,
            zipcode: shippingAddress.address.zipcode,
            country: shippingAddress.address.country,
            createdAt: shippingAddress.createdAt,
            updatedAt: shippingAddress.updatedAt,
        };
    }
}
exports.PrismaShippingAddressMapper = PrismaShippingAddressMapper;
//# sourceMappingURL=prisma-shipping-address-mapper.js.map