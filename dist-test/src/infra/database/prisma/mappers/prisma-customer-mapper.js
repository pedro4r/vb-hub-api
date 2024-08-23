"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaCustomerMapper = void 0;
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const customer_1 = require("../../../../domain/customer/enterprise/entities/customer");
class PrismaCustomerMapper {
    static toDomain(raw) {
        return customer_1.Customer.create({
            firstName: raw.firstName,
            lastName: raw.lastName,
            hubId: raw.hubId,
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID(raw.parcelForwardingId),
            email: raw.email,
            password: raw.password,
            createdAt: raw.createdAt,
        }, new unique_entity_id_1.UniqueEntityID(raw.id));
    }
    static toPrisma(customer) {
        return {
            id: customer.id.toString(),
            firstName: customer.firstName,
            lastName: customer.lastName,
            parcelForwardingId: customer.parcelForwardingId.toString(),
            hubId: customer.hubId,
            email: customer.email,
            password: customer.password,
        };
    }
}
exports.PrismaCustomerMapper = PrismaCustomerMapper;
//# sourceMappingURL=prisma-customer-mapper.js.map