"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageFactory = void 0;
exports.makePackage = makePackage;
const unique_entity_id_1 = require("../../src/core/entities/unique-entity-id");
const package_1 = require("../../src/domain/customer/enterprise/entities/package");
const prisma_package_mapper_1 = require("../../src/infra/database/prisma/mappers/prisma-package-mapper");
const prisma_service_1 = require("../../src/infra/database/prisma/prisma.service");
const common_1 = require("@nestjs/common");
function makePackage(override = {}, id) {
    const address = package_1.Package.create({
        customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
        parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcel-forwarding-1'),
        shippingAddressId: new unique_entity_id_1.UniqueEntityID('shipping-address-1'),
        hasBattery: false,
        ...override,
    }, id);
    return address;
}
let PackageFactory = class PackageFactory {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async makePrismaPackage(data = {}) {
        const pkg = makePackage(data);
        await this.prisma.package.create({
            data: prisma_package_mapper_1.PrismaPackageMapper.toPrisma(pkg),
        });
        return pkg;
    }
};
exports.PackageFactory = PackageFactory;
exports.PackageFactory = PackageFactory = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PackageFactory);
//# sourceMappingURL=make-package.js.map