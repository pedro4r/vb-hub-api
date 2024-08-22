"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaCheckInMapper = void 0;
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const check_in_1 = require("../../../../domain/parcel-forwarding/enterprise/entities/check-in");
class PrismaCheckInMapper {
    static toDomain(raw) {
        return check_in_1.CheckIn.create({
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID(raw.parcelForwardingId),
            customerId: new unique_entity_id_1.UniqueEntityID(raw.customerId),
            status: raw.status,
            details: raw.details,
            weight: raw.weight,
            packageId: raw.packageId ? new unique_entity_id_1.UniqueEntityID(raw.packageId) : null,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        }, new unique_entity_id_1.UniqueEntityID(raw.id));
    }
    static toPrisma(checkIn) {
        return {
            id: checkIn.id.toString(),
            status: checkIn.getStatusAsCode(),
            parcelForwardingId: checkIn.parcelForwardingId.toString(),
            customerId: checkIn.customerId.toString(),
            packageId: checkIn.packageId?.toString(),
            details: checkIn.details,
            weight: checkIn.weight,
            createdAt: checkIn.createdAt,
            updatedAt: checkIn.updatedAt,
        };
    }
}
exports.PrismaCheckInMapper = PrismaCheckInMapper;
//# sourceMappingURL=prisma-check-in-mapper.js.map