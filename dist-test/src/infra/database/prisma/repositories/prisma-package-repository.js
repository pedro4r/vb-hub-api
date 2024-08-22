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
exports.PrismaPackageRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const prisma_package_mapper_1 = require("../mappers/prisma-package-mapper");
const package_shipping_address_repository_1 = require("../../../../domain/customer/application/repositories/package-shipping-address-repository");
const package_preview_1 = require("../../../../domain/parcel-forwarding/enterprise/entities/value-objects/package-preview");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const package_details_1 = require("../../../../domain/parcel-forwarding/enterprise/entities/value-objects/package-details");
let PrismaPackageRepository = class PrismaPackageRepository {
    prisma;
    packageShippingAddressRepository;
    constructor(prisma, packageShippingAddressRepository) {
        this.prisma = prisma;
        this.packageShippingAddressRepository = packageShippingAddressRepository;
    }
    async findDetailsById(id) {
        const pkg = await this.prisma.package.findUnique({
            where: {
                id,
            },
        });
        if (!pkg) {
            return null;
        }
        const shippingAddress = await this.packageShippingAddressRepository.findById(pkg.packageShippingAddressId.toString());
        if (!shippingAddress) {
            throw new resource_not_found_error_1.ResourceNotFoundError(`Shipping address with ID "${pkg.packageShippingAddressId.toString()}" does not exist.`);
        }
        const customer = await this.prisma.customer.findUnique({
            where: {
                id: pkg.customerId.toString(),
            },
        });
        if (!customer) {
            throw new resource_not_found_error_1.ResourceNotFoundError(`Customer with ID "${pkg.customerId.toString()}" does not exist.`);
        }
        const packageToDomain = prisma_package_mapper_1.PrismaPackageMapper.toDomain(pkg);
        return package_details_1.PackageDetails.create({
            packageId: packageToDomain.id,
            parcelForwardingId: packageToDomain.parcelForwardingId,
            customerId: packageToDomain.customerId,
            hubId: customer.hubId,
            customerFirstName: customer.firstName,
            customerLastName: customer.lastName,
            packageShippingAddress: shippingAddress,
            hasBattery: packageToDomain.hasBattery,
            weight: packageToDomain.weight,
            trackingNumber: packageToDomain.trackingNumber,
            createdAt: packageToDomain.createdAt,
            updatedAt: packageToDomain.updatedAt,
        });
    }
    async create(pkg) {
        await this.packageShippingAddressRepository.create(pkg.shippingAddressId.toString());
        const data = prisma_package_mapper_1.PrismaPackageMapper.toPrisma(pkg);
        await this.prisma.package.create({
            data,
        });
    }
    async findById(id) {
        const pkg = await this.prisma.package.findUnique({
            where: {
                id,
            },
        });
        if (!pkg) {
            return null;
        }
        return prisma_package_mapper_1.PrismaPackageMapper.toDomain(pkg);
    }
    async save(pkg) {
        const data = prisma_package_mapper_1.PrismaPackageMapper.toPrisma(pkg);
        await this.prisma.package.update({
            where: {
                id: pkg.id.toString(),
            },
            data,
        });
    }
    async delete(pkg) {
        const data = prisma_package_mapper_1.PrismaPackageMapper.toPrisma(pkg);
        await this.prisma.package.delete({
            where: {
                id: data.id,
            },
        });
    }
    async findManyByCustomerId(id) {
        const packages = await this.prisma.package.findMany({
            where: {
                customerId: id,
            },
        });
        return packages.map((pkg) => prisma_package_mapper_1.PrismaPackageMapper.toDomain(pkg));
    }
    async findManyRecentByParcelForwardingId(parcelForwardingId, page) {
        const packages = await this.prisma.package.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            where: {
                parcelForwardingId,
            },
            take: 20,
            skip: (page - 1) * 20,
        });
        const packagesPreviews = await Promise.all(packages.map(async (pkg) => {
            const customer = await this.prisma.customer.findUnique({
                where: {
                    id: pkg.customerId.toString(),
                },
            });
            if (!customer) {
                throw new resource_not_found_error_1.ResourceNotFoundError(`Customer with ID "${pkg.customerId.toString()}" does not exist.`);
            }
            const packageDomain = prisma_package_mapper_1.PrismaPackageMapper.toDomain(pkg);
            return package_preview_1.PackagePreview.create({
                packageId: packageDomain.id,
                parcelForwardingId: packageDomain.parcelForwardingId,
                customerId: packageDomain.customerId,
                hubId: customer.hubId,
                customerFirstName: customer.firstName,
                customerLastName: customer.lastName,
                hasBattery: packageDomain.hasBattery,
                weight: packageDomain.weight,
                trackingNumber: packageDomain.trackingNumber,
                createdAt: packageDomain.createdAt,
                updatedAt: packageDomain.updatedAt,
            });
        }));
        return packagesPreviews;
    }
};
exports.PrismaPackageRepository = PrismaPackageRepository;
exports.PrismaPackageRepository = PrismaPackageRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        package_shipping_address_repository_1.PackageShippingAddressRepository])
], PrismaPackageRepository);
//# sourceMappingURL=prisma-package-repository.js.map