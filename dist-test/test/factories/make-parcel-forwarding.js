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
exports.ParcelForwardingFactory = void 0;
exports.makeParcelForwarding = makeParcelForwarding;
const parcel_forwarding_1 = require("../../src/domain/parcel-forwarding/enterprise/entities/parcel-forwarding");
const prisma_parcel_forwarding_mapper_1 = require("../../src/infra/database/prisma/mappers/prisma-parcel-forwarding-mapper");
const prisma_service_1 = require("../../src/infra/database/prisma/prisma.service");
const faker_1 = require("@faker-js/faker");
const common_1 = require("@nestjs/common");
function makeParcelForwarding(override = {}, id) {
    const student = parcel_forwarding_1.ParcelForwarding.create({
        name: faker_1.faker.company.buzzNoun(),
        initials: faker_1.faker.string.fromCharacters('ABCDEF', 3),
        email: faker_1.faker.internet.email(),
        password: faker_1.faker.internet.password(),
        ...override,
    }, id);
    return student;
}
let ParcelForwardingFactory = class ParcelForwardingFactory {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async makePrismaParcelForwarding(data = {}) {
        const parcelForwarding = makeParcelForwarding(data);
        await this.prisma.parcelForwarding.create({
            data: prisma_parcel_forwarding_mapper_1.PrismaParcelForwardingMapper.toPrisma(parcelForwarding),
        });
        return parcelForwarding;
    }
};
exports.ParcelForwardingFactory = ParcelForwardingFactory;
exports.ParcelForwardingFactory = ParcelForwardingFactory = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ParcelForwardingFactory);
//# sourceMappingURL=make-parcel-forwarding.js.map