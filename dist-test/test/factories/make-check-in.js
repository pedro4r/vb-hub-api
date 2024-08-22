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
exports.CheckInFactory = void 0;
exports.makeCheckIn = makeCheckIn;
const unique_entity_id_1 = require("../../src/core/entities/unique-entity-id");
const check_in_1 = require("../../src/domain/parcel-forwarding/enterprise/entities/check-in");
const prisma_check_in_mapper_1 = require("../../src/infra/database/prisma/mappers/prisma-check-in-mapper");
const prisma_service_1 = require("../../src/infra/database/prisma/prisma.service");
const faker_1 = require("@faker-js/faker");
const common_1 = require("@nestjs/common");
function makeCheckIn(override = {}, id) {
    const checkin = check_in_1.CheckIn.create({
        parcelForwardingId: new unique_entity_id_1.UniqueEntityID(),
        customerId: new unique_entity_id_1.UniqueEntityID(),
        status: faker_1.faker.number.int({ min: 1, max: 7 }),
        details: faker_1.faker.lorem.text(),
        weight: faker_1.faker.number.float(),
        createdAt: new Date(),
        ...override,
    }, id);
    return checkin;
}
let CheckInFactory = class CheckInFactory {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async makePrismaCheckIn(data = {}) {
        const checkIn = makeCheckIn(data);
        await this.prisma.checkIn.create({
            data: prisma_check_in_mapper_1.PrismaCheckInMapper.toPrisma(checkIn),
        });
        return checkIn;
    }
};
exports.CheckInFactory = CheckInFactory;
exports.CheckInFactory = CheckInFactory = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CheckInFactory);
//# sourceMappingURL=make-check-in.js.map