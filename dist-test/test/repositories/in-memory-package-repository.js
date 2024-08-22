"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryPackageRepository = void 0;
const domain_events_1 = require("../../src/core/events/domain-events");
const package_details_1 = require("../../src/domain/parcel-forwarding/enterprise/entities/value-objects/package-details");
const package_preview_1 = require("../../src/domain/parcel-forwarding/enterprise/entities/value-objects/package-preview");
class InMemoryPackageRepository {
    customsDeclarationItemsRepository;
    packageShippingAddressRepository;
    checkInsRepository;
    customerRepository;
    items = [];
    constructor(customsDeclarationItemsRepository, packageShippingAddressRepository, checkInsRepository, customerRepository) {
        this.customsDeclarationItemsRepository = customsDeclarationItemsRepository;
        this.packageShippingAddressRepository = packageShippingAddressRepository;
        this.checkInsRepository = checkInsRepository;
        this.customerRepository = customerRepository;
    }
    async findManyRecentByParcelForwardingId(parcelForwardingId, page) {
        const packages = this.items
            .filter((item) => item.parcelForwardingId.toString() === parcelForwardingId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice((page - 1) * 20, page * 20);
        const packagesPreviews = await Promise.all(packages.map(async (pkg) => {
            const customer = await this.customerRepository.findById(pkg.customerId.toString());
            if (!customer) {
                throw new Error(`Customer with ID "${pkg.customerId.toString()}" does not exist.`);
            }
            return package_preview_1.PackagePreview.create({
                packageId: pkg.id,
                parcelForwardingId: pkg.parcelForwardingId,
                customerId: pkg.customerId,
                hubId: customer.hubId,
                customerFirstName: customer.firstName,
                customerLastName: customer.lastName,
                weight: pkg.weight,
                hasBattery: pkg.hasBattery,
                trackingNumber: pkg.trackingNumber,
                createdAt: pkg.createdAt,
                updatedAt: pkg.updatedAt,
            });
        }));
        return packagesPreviews;
    }
    async findManyByCustomerId(id) {
        const packages = this.items.filter((pkg) => pkg.customerId.toString() === id);
        return packages;
    }
    async create(pkg) {
        this.items.push(pkg);
        await this.packageShippingAddressRepository.create(pkg.shippingAddressId.toString());
        if (pkg.customsDeclarationList) {
            await this.customsDeclarationItemsRepository.createMany(pkg.customsDeclarationList.getItems());
        }
        await this.checkInsRepository.linkManyCheckInToPackage(pkg.checkIns.getItems());
        domain_events_1.DomainEvents.dispatchEventsForAggregate(pkg.id);
    }
    async findById(id) {
        const pkg = this.items.find((pkg) => pkg.id.toString() === id);
        if (!pkg) {
            return null;
        }
        return pkg;
    }
    async save(pkg) {
        const index = this.items.findIndex((item) => item.id.equals(pkg.id));
        this.items[index] = pkg;
        if (pkg.customsDeclarationList) {
            await this.customsDeclarationItemsRepository.deleteMany(pkg.customsDeclarationList.getRemovedItems());
            await this.customsDeclarationItemsRepository.createMany(pkg.customsDeclarationList.getItems());
        }
        await this.checkInsRepository.unlinkManyCheckInToPackage(pkg.checkIns.getRemovedItems());
        await this.checkInsRepository.linkManyCheckInToPackage(pkg.checkIns.getItems());
        domain_events_1.DomainEvents.dispatchEventsForAggregate(pkg.id);
    }
    async delete(pkg) {
        await this.packageShippingAddressRepository.delete(pkg.shippingAddressId.toString());
        await this.customsDeclarationItemsRepository.deleteMany(pkg.customsDeclarationList.getItems());
        await this.checkInsRepository.unlinkManyCheckInToPackage(pkg.checkIns.getItems());
        this.items = this.items.filter((item) => !item.id.equals(pkg.id));
    }
    async findDetailsById(packageId) {
        const pkg = this.items.find((item) => item.id.toString() === packageId);
        if (!pkg) {
            return null;
        }
        const customer = await this.customerRepository.findById(pkg.customerId.toString());
        if (!customer) {
            throw new Error(`Customer with ID "${pkg.customerId.toString()}" does not exist.`);
        }
        const packageShippindAddress = await this.packageShippingAddressRepository.findById(pkg.shippingAddressId.toString());
        if (!packageShippindAddress) {
            throw new Error(`Package shipping address with ID "${pkg.shippingAddressId.toString()}" does not exist.`);
        }
        return package_details_1.PackageDetails.create({
            packageId: pkg.id,
            parcelForwardingId: pkg.parcelForwardingId,
            customerId: pkg.customerId,
            packageShippingAddress: packageShippindAddress,
            hubId: customer.hubId,
            customerFirstName: customer.firstName,
            customerLastName: customer.lastName,
            weight: pkg.weight,
            hasBattery: pkg.hasBattery,
            trackingNumber: pkg.trackingNumber,
            createdAt: pkg.createdAt,
            updatedAt: pkg.updatedAt,
        });
    }
}
exports.InMemoryPackageRepository = InMemoryPackageRepository;
//# sourceMappingURL=in-memory-package-repository.js.map