"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_package_repository_1 = require("../../../../../test/repositories/in-memory-package-repository");
const make_package_1 = require("../../../../../test/factories/make-package");
const in_memory_check_ins_attachments_repository_1 = require("../../../../../test/repositories/in-memory-check-ins-attachments-repository");
const in_memory_check_ins_repository_1 = require("../../../../../test/repositories/in-memory-check-ins-repository");
const in_memory_customs_declaration_items_repository_1 = require("../../../../../test/repositories/in-memory-customs-declaration-items-repository");
const in_memory_shipping_address_repository_1 = require("../../../../../test/repositories/in-memory-shipping-address-repository");
const in_memory_package_shipping_address_repository_1 = require("../../../../../test/repositories/in-memory-package-shipping-address-repository");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const make_shipping_address_1 = require("../../../../../test/factories/make-shipping-address");
const in_memory_customer_repository_1 = require("../../../../../test/repositories/in-memory-customer-repository");
const in_memory_attachments_repository_1 = require("../../../../../test/repositories/in-memory-attachments-repository");
const fetch_recent_packages_1 = require("./fetch-recent-packages");
const make_customer_1 = require("../../../../../test/factories/make-customer");
let inMemoryCustomerRepository;
let inMemoryAttachmentsRepository;
let inMemoryCheckInsAttachmentsRepository;
let inMemoryCheckInsRepository;
let inMemoryCustomsDeclarationItemsRepository;
let inMemoryShippingAddressRepository;
let inMemoryPackageShippingAddressRepository;
let inMemoryPackageRepository;
let sut;
describe('Fetch Recent Packages', () => {
    beforeEach(async () => {
        inMemoryCustomerRepository = new in_memory_customer_repository_1.InMemoryCustomerRepository();
        inMemoryAttachmentsRepository = new in_memory_attachments_repository_1.InMemoryAttachmentsRepository();
        inMemoryCheckInsAttachmentsRepository =
            new in_memory_check_ins_attachments_repository_1.InMemoryCheckInsAttachmentsRepository();
        inMemoryCheckInsRepository = new in_memory_check_ins_repository_1.InMemoryCheckInsRepository(inMemoryCheckInsAttachmentsRepository, inMemoryAttachmentsRepository, inMemoryCustomerRepository);
        inMemoryCustomsDeclarationItemsRepository =
            new in_memory_customs_declaration_items_repository_1.InMemoryCustomsDeclarationItemsRepository();
        inMemoryShippingAddressRepository = new in_memory_shipping_address_repository_1.InMemoryShippingAddressRepository();
        inMemoryPackageShippingAddressRepository =
            new in_memory_package_shipping_address_repository_1.InMemoryPackageShippingAddressRepository(inMemoryShippingAddressRepository);
        inMemoryPackageRepository = new in_memory_package_repository_1.InMemoryPackageRepository(inMemoryCustomsDeclarationItemsRepository, inMemoryPackageShippingAddressRepository, inMemoryCheckInsRepository, inMemoryCustomerRepository);
        sut = new fetch_recent_packages_1.FetchRecentPackagesUseCase(inMemoryPackageRepository);
        const customer1 = (0, make_customer_1.makeCustomer)({}, new unique_entity_id_1.UniqueEntityID('customer-1'));
        await inMemoryCustomerRepository.create(customer1);
        const shippingAddress1 = (0, make_shipping_address_1.makeShippingAddress)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
        }, new unique_entity_id_1.UniqueEntityID('shippingAddress-1'));
        await inMemoryShippingAddressRepository.create(shippingAddress1);
        const newPkg1 = (0, make_package_1.makePackage)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
            shippingAddressId: new unique_entity_id_1.UniqueEntityID('shippingAddress-1'),
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcel-forwarding-1'),
            hasBattery: false,
        }, new unique_entity_id_1.UniqueEntityID('package-1'));
        await inMemoryPackageRepository.create(newPkg1);
        const customer2 = (0, make_customer_1.makeCustomer)({}, new unique_entity_id_1.UniqueEntityID('customer-2'));
        await inMemoryCustomerRepository.create(customer2);
        const shippingAddress2 = (0, make_shipping_address_1.makeShippingAddress)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-2'),
        }, new unique_entity_id_1.UniqueEntityID('shippingAddress-2'));
        await inMemoryShippingAddressRepository.create(shippingAddress2);
        const newPkg2 = (0, make_package_1.makePackage)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-2'),
            shippingAddressId: new unique_entity_id_1.UniqueEntityID('shippingAddress-2'),
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcel-forwarding-1'),
            hasBattery: false,
        }, new unique_entity_id_1.UniqueEntityID('package-2'));
        await inMemoryPackageRepository.create(newPkg2);
    });
    it('should be able to fetch recent packages', async () => {
        const result = await sut.execute({
            parcelForwardingId: 'parcel-forwarding-1',
            page: 1,
        });
        expect(result.isRight()).toBeTruthy();
        expect(result.value).toEqual({
            packagePreview: expect.arrayContaining([
                expect.objectContaining({
                    parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcel-forwarding-1'),
                    customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
                    hasBattery: expect.any(Boolean),
                }),
                expect.objectContaining({
                    parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcel-forwarding-1'),
                    customerId: new unique_entity_id_1.UniqueEntityID('customer-2'),
                    hasBattery: expect.any(Boolean),
                }),
            ]),
        });
    });
    it('should not be able to fetch recent packages', async () => {
        const result = await sut.execute({
            parcelForwardingId: 'parcel-forwarding-2',
            page: 1,
        });
        expect(result.isLeft()).toBeTruthy();
    });
});
//# sourceMappingURL=fetch-recent-packages.test.js.map