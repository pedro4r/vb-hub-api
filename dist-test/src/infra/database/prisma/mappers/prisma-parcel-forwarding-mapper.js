"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaParcelForwardingMapper = void 0;
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const parcel_forwarding_1 = require("../../../../domain/parcel-forwarding/enterprise/entities/parcel-forwarding");
class PrismaParcelForwardingMapper {
    static toDomain(raw) {
        return parcel_forwarding_1.ParcelForwarding.create({
            name: raw.name,
            initials: raw.initials,
            email: raw.email,
            password: raw.password,
        }, new unique_entity_id_1.UniqueEntityID(raw.id));
    }
    static toPrisma(parcelForwarding) {
        return {
            id: parcelForwarding.id.toString(),
            name: parcelForwarding.name,
            initials: parcelForwarding.initials,
            email: parcelForwarding.email,
            password: parcelForwarding.password,
        };
    }
}
exports.PrismaParcelForwardingMapper = PrismaParcelForwardingMapper;
//# sourceMappingURL=prisma-parcel-forwarding-mapper.js.map