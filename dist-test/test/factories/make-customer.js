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
exports.CustomerFactory = void 0;
exports.makeCustomer = makeCustomer;
const unique_entity_id_1 = require("../../src/core/entities/unique-entity-id");
const customer_1 = require("../../src/domain/customer/enterprise/entities/customer");
const prisma_customer_mapper_1 = require("../../src/infra/database/prisma/mappers/prisma-customer-mapper");
const prisma_service_1 = require("../../src/infra/database/prisma/prisma.service");
const faker_1 = require("@faker-js/faker");
const common_1 = require("@nestjs/common");
function makeCustomer(override = {}, id) {
    const student = customer_1.Customer.create({
        parcelForwardingId: new unique_entity_id_1.UniqueEntityID(),
        hubId: faker_1.faker.number.int({ min: 1, max: 1000 }),
        firstName: faker_1.faker.person.fullName(),
        lastName: faker_1.faker.person.fullName(),
        email: faker_1.faker.internet.email(),
        password: faker_1.faker.internet.password(),
        createdAt: new Date(),
        ...override,
    }, id);
    return student;
}
let CustomerFactory = class CustomerFactory {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async makePrismaCustomer(data = {}) {
        const customer = makeCustomer(data);
        await this.prisma.customer.create({
            data: prisma_customer_mapper_1.PrismaCustomerMapper.toPrisma(customer),
        });
        return customer;
    }
};
exports.CustomerFactory = CustomerFactory;
exports.CustomerFactory = CustomerFactory = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomerFactory);
//# sourceMappingURL=make-customer.js.map