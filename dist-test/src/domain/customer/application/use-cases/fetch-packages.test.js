"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_package_repository_1 = require("../../../../../test/repositories/in-memory-package-repository");
const make_package_1 = require("../../../../../test/factories/make-package");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const fetch_package_1 = require("./fetch-package");
const in_memory_check_ins_attachments_repository_1 = require("../../../../../test/repositories/in-memory-check-ins-attachments-repository");
const in_memory_check_ins_repository_1 = require("../../../../../test/repositories/in-memory-check-ins-repository");
const in_memory_customs_declaration_items_repository_1 = require("../../../../../test/repositories/in-memory-customs-declaration-items-repository");
const in_memory_shipping_address_repository_1 = require("../../../../../test/repositories/in-memory-shipping-address-repository");
const in_memory_package_shipping_address_repository_1 = require("../../../../../test/repositories/in-memory-package-shipping-address-repository");
const make_shipping_address_1 = require("../../../../../test/factories/make-shipping-address");
const make_check_in_1 = require("../../../../../test/factories/make-check-in");
const package_check_in_1 = require("../../enterprise/entities/package-check-in");
const package_check_ins_list_1 = require("../../enterprise/entities/package-check-ins-list");
const make_customs_declaration_items_1 = require("../../../../../test/factories/make-customs-declaration-items");
const customs_declaration_list_1 = require("../../enterprise/entities/customs-declaration-list");
const in_memory_customer_repository_1 = require("../../../../../test/repositories/in-memory-customer-repository");
const in_memory_attachments_repository_1 = require("../../../../../test/repositories/in-memory-attachments-repository");
let inMemoryCustomerRepository;
let inMemoryAttachmentsRepository;
let inMemoryCheckInsAttachmentsRepository;
let inMemoryCheckInsRepository;
let inMemoryCustomsDeclarationItemsRepository;
let inMemoryShippingAddressRepository;
let inMemoryPackageShippingAddressRepository;
let inMemoryPackageRepository;
let sut;
describe('Get an Package', () => {
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
        sut = new fetch_package_1.FetchPackageUseCase(inMemoryPackageRepository);
        const shippingAddress1 = (0, make_shipping_address_1.makeShippingAddress)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
        }, new unique_entity_id_1.UniqueEntityID('shippingAddress-1'));
        await inMemoryShippingAddressRepository.create(shippingAddress1);
        const checkIn1 = (0, make_check_in_1.makeCheckIn)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcelForwarding-1'),
        }, new unique_entity_id_1.UniqueEntityID('check-in-1'));
        const checkIn2 = (0, make_check_in_1.makeCheckIn)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcelForwarding-1'),
        }, new unique_entity_id_1.UniqueEntityID('check-in-2'));
        const checkIn3 = (0, make_check_in_1.makeCheckIn)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcelForwarding-1'),
        }, new unique_entity_id_1.UniqueEntityID('check-in-3'));
        await inMemoryCheckInsRepository.create(checkIn1);
        await inMemoryCheckInsRepository.create(checkIn2);
        await inMemoryCheckInsRepository.create(checkIn3);
        const packageCheckIns1 = [
            package_check_in_1.PackageCheckIn.create({
                checkInId: checkIn1.id,
                packageId: new unique_entity_id_1.UniqueEntityID('package-1'),
            }),
            package_check_in_1.PackageCheckIn.create({
                checkInId: checkIn2.id,
                packageId: new unique_entity_id_1.UniqueEntityID('package-1'),
            }),
        ];
        const packageCheckIns2 = [
            package_check_in_1.PackageCheckIn.create({
                checkInId: checkIn3.id,
                packageId: new unique_entity_id_1.UniqueEntityID('package-1'),
            }),
        ];
        const pkg1 = (0, make_package_1.makePackage)({
            shippingAddressId: new unique_entity_id_1.UniqueEntityID('shippingAddress-1'),
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcelForwarding-1'),
            hasBattery: false,
        }, new unique_entity_id_1.UniqueEntityID('package-1'));
        const pkg2 = (0, make_package_1.makePackage)({
            shippingAddressId: new unique_entity_id_1.UniqueEntityID('shippingAddress-1'),
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcelForwarding-1'),
            hasBattery: false,
        }, new unique_entity_id_1.UniqueEntityID('package-2'));
        pkg1.checkIns = new package_check_ins_list_1.PackageCheckInsList(packageCheckIns1);
        pkg2.checkIns = new package_check_ins_list_1.PackageCheckInsList(packageCheckIns2);
        const customsDeclarationItems1 = (0, make_customs_declaration_items_1.makeCustomsDeclarationItems)(pkg1.id);
        const customsDeclarationItems2 = (0, make_customs_declaration_items_1.makeCustomsDeclarationItems)(pkg2.id);
        pkg1.customsDeclarationList = new customs_declaration_list_1.CustomsDeclarationList(customsDeclarationItems1);
        pkg2.customsDeclarationList = new customs_declaration_list_1.CustomsDeclarationList(customsDeclarationItems2);
        await inMemoryPackageRepository.create(pkg1);
        await inMemoryPackageRepository.create(pkg2);
    });
    it('should be able to fetch packages', async () => {
        const result = await sut.execute({
            customerId: 'customer-1',
        });
        expect(result.isRight()).toBeTruthy();
        expect(result.value).toEqual({
            packages: expect.arrayContaining([
                expect.objectContaining({
                    id: new unique_entity_id_1.UniqueEntityID('package-1'),
                }),
                expect.objectContaining({
                    id: new unique_entity_id_1.UniqueEntityID('package-2'),
                }),
            ]),
        });
        expect(inMemoryPackageRepository.items.length).toEqual(2);
        expect(inMemoryCheckInsRepository.items.length).toEqual(3);
        expect(inMemoryCustomsDeclarationItemsRepository.items.length).toEqual(6);
    });
    it('should not be able to fetch packages from another customer', async () => {
        const result = await sut.execute({
            customerId: 'customer-2',
        });
        expect(result.isLeft()).toBeTruthy();
    });
});
//# sourceMappingURL=fetch-packages.test.js.map