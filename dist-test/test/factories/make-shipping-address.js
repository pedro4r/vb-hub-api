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
exports.ShippingAddressFactory = void 0;
exports.makeShippingAddress = makeShippingAddress;
const unique_entity_id_1 = require("../../src/core/entities/unique-entity-id");
const shipping_address_1 = require("../../src/domain/customer/enterprise/entities/shipping-address");
const faker_1 = require("@faker-js/faker");
const make_address_1 = require("./make-address");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../src/infra/database/prisma/prisma.service");
const prisma_shipping_address_mapper_1 = require("../../src/infra/database/prisma/mappers/prisma-shipping-address-mapper");
function makeShippingAddress(override = {}, id) {
    const shippingAddress = shipping_address_1.ShippingAddress.create({
        customerId: new unique_entity_id_1.UniqueEntityID(),
        recipientName: faker_1.faker.person.firstName(),
        taxId: faker_1.faker.number.int({ min: 8, max: 10 }).toString(),
        email: faker_1.faker.internet.email(),
        phoneNumber: faker_1.faker.number.int({ min: 8, max: 10 }).toString(),
        address: (0, make_address_1.makeAddress)(),
        createdAt: new Date(),
        ...override,
    }, id);
    return shippingAddress;
}
let ShippingAddressFactory = class ShippingAddressFactory {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async makePrismaShippingAddress(data = {}) {
        const shippingAddress = makeShippingAddress(data);
        await this.prisma.shippingAddress.create({
            data: prisma_shipping_address_mapper_1.PrismaShippingAddressMapper.toPrisma(shippingAddress),
        });
        return shippingAddress;
    }
};
exports.ShippingAddressFactory = ShippingAddressFactory;
exports.ShippingAddressFactory = ShippingAddressFactory = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ShippingAddressFactory);
//# sourceMappingURL=make-shipping-address.js.map