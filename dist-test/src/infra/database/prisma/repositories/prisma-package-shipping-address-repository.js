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
exports.PrismaPackageShippingAddressRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const shipping_address_repository_1 = require("../../../../domain/customer/application/repositories/shipping-address-repository");
const prisma_package_shipping_address_mapper_1 = require("../mappers/prisma-package-shipping-address-mapper");
let PrismaPackageShippingAddressRepository = class PrismaPackageShippingAddressRepository {
    prisma;
    shippingAddressRepository;
    constructor(prisma, shippingAddressRepository) {
        this.prisma = prisma;
        this.shippingAddressRepository = shippingAddressRepository;
    }
    async findById(shippingAddressId) {
        const shippingAddress = await this.prisma.packageShippingAddress.findUnique({
            where: {
                id: shippingAddressId,
            },
        });
        if (!shippingAddress) {
            return null;
        }
        return prisma_package_shipping_address_mapper_1.PrismaPackageShippingAddressMapper.toDomain(shippingAddress);
    }
    async create(shippingAddressId) {
        const shippingAddress = await this.shippingAddressRepository.findById(shippingAddressId);
        if (!shippingAddress) {
            throw new Error('Shipping address not found');
        }
        const data = prisma_package_shipping_address_mapper_1.PrismaPackageShippingAddressMapper.toPrisma(shippingAddress);
        await this.prisma.packageShippingAddress.create({
            data,
        });
    }
    async delete(shippingAddressId) {
        await this.prisma.packageShippingAddress.delete({
            where: {
                id: shippingAddressId,
            },
        });
    }
};
exports.PrismaPackageShippingAddressRepository = PrismaPackageShippingAddressRepository;
exports.PrismaPackageShippingAddressRepository = PrismaPackageShippingAddressRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        shipping_address_repository_1.ShippingAddressRepository])
], PrismaPackageShippingAddressRepository);
//# sourceMappingURL=prisma-package-shipping-address-repository.js.map