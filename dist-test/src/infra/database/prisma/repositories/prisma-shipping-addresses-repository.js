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
exports.PrismaShippingAddressesRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const prisma_shipping_address_mapper_1 = require("../mappers/prisma-shipping-address-mapper");
let PrismaShippingAddressesRepository = class PrismaShippingAddressesRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findManyByCustomerId(customerId) {
        const shippingAddresses = await this.prisma.shippingAddress.findMany({
            where: {
                customerId,
            },
        });
        return shippingAddresses.map(prisma_shipping_address_mapper_1.PrismaShippingAddressMapper.toDomain);
    }
    async findById(shippingAddressId) {
        const shippingAddress = await this.prisma.shippingAddress.findUnique({
            where: {
                id: shippingAddressId,
            },
        });
        if (!shippingAddress) {
            return null;
        }
        return prisma_shipping_address_mapper_1.PrismaShippingAddressMapper.toDomain(shippingAddress);
    }
    async create(shippingAddress) {
        const data = prisma_shipping_address_mapper_1.PrismaShippingAddressMapper.toPrisma(shippingAddress);
        await this.prisma.shippingAddress.create({
            data,
        });
    }
    async save(shippingAddress) {
        const data = prisma_shipping_address_mapper_1.PrismaShippingAddressMapper.toPrisma(shippingAddress);
        await this.prisma.shippingAddress.update({
            where: {
                id: shippingAddress.id.toString(),
            },
            data,
        });
    }
    async delete(shippingAddress) {
        const data = prisma_shipping_address_mapper_1.PrismaShippingAddressMapper.toPrisma(shippingAddress);
        await this.prisma.shippingAddress.delete({
            where: {
                id: data.id,
            },
        });
    }
};
exports.PrismaShippingAddressesRepository = PrismaShippingAddressesRepository;
exports.PrismaShippingAddressesRepository = PrismaShippingAddressesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaShippingAddressesRepository);
//# sourceMappingURL=prisma-shipping-addresses-repository.js.map