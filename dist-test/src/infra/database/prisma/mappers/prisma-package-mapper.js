"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaPackageMapper = void 0;
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const package_1 = require("../../../../domain/customer/enterprise/entities/package");
class PrismaPackageMapper {
    static toDomain(raw) {
        return package_1.Package.create({
            customerId: new unique_entity_id_1.UniqueEntityID(raw.customerId),
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID(raw.parcelForwardingId),
            shippingAddressId: new unique_entity_id_1.UniqueEntityID(raw.packageShippingAddressId),
            weight: raw.weight,
            hasBattery: raw.hasBattery,
        }, new unique_entity_id_1.UniqueEntityID(raw.id));
    }
    static toPrisma(pkg) {
        return {
            id: pkg.id.toString(),
            customerId: pkg.customerId.toString(),
            parcelForwardingId: pkg.parcelForwardingId.toString(),
            packageShippingAddressId: pkg.shippingAddressId.toString(),
            weight: pkg.weight ?? null,
            hasBattery: pkg.hasBattery,
            trackingNumber: pkg.trackingNumber ?? null,
        };
    }
}
exports.PrismaPackageMapper = PrismaPackageMapper;
//# sourceMappingURL=prisma-package-mapper.js.map