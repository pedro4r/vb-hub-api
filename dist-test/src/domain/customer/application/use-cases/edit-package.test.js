"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_package_repository_1 = require("../../../../../test/repositories/in-memory-package-repository");
const edit_package_1 = require("./edit-package");
const make_package_1 = require("../../../../../test/factories/make-package");
const in_memory_check_ins_attachments_repository_1 = require("../../../../../test/repositories/in-memory-check-ins-attachments-repository");
const in_memory_check_ins_repository_1 = require("../../../../../test/repositories/in-memory-check-ins-repository");
const in_memory_declaration_model_items_repository_1 = require("../../../../../test/repositories/in-memory-declaration-model-items-repository");
const in_memory_customs_declaration_items_repository_1 = require("../../../../../test/repositories/in-memory-customs-declaration-items-repository");
const in_memory_shipping_address_repository_1 = require("../../../../../test/repositories/in-memory-shipping-address-repository");
const in_memory_package_shipping_address_repository_1 = require("../../../../../test/repositories/in-memory-package-shipping-address-repository");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const make_check_in_1 = require("../../../../../test/factories/make-check-in");
const make_shipping_address_1 = require("../../../../../test/factories/make-shipping-address");
const package_check_ins_list_1 = require("../../enterprise/entities/package-check-ins-list");
const package_check_in_1 = require("../../enterprise/entities/package-check-in");
const customs_declaration_list_1 = require("../../enterprise/entities/customs-declaration-list");
const make_customs_declaration_items_1 = require("../../../../../test/factories/make-customs-declaration-items");
const in_memory_declaration_model_repository_1 = require("../../../../../test/repositories/in-memory-declaration-model-repository");
const make_declaration_model_with_items_1 = require("../../../../../test/factories/make-declaration-model-with-items");
const in_memory_customer_repository_1 = require("../../../../../test/repositories/in-memory-customer-repository");
const in_memory_attachments_repository_1 = require("../../../../../test/repositories/in-memory-attachments-repository");
let inMemoryCustomerRepository;
let inMemoryAttachmentsRepository;
let inMemoryDeclarationModelsRepository;
let inMemoryCheckInsAttachmentsRepository;
let inMemoryCheckInsRepository;
let inMemoryDeclarationModelsItemsRepository;
let inMemoryCustomsDeclarationItemsRepository;
let inMemoryShippingAddressRepository;
let inMemoryPackageShippingAddressRepository;
let inMemoryPackageRepository;
let sut;
describe('Edit Package', () => {
    beforeEach(async () => {
        inMemoryCustomerRepository = new in_memory_customer_repository_1.InMemoryCustomerRepository();
        inMemoryAttachmentsRepository = new in_memory_attachments_repository_1.InMemoryAttachmentsRepository();
        inMemoryCheckInsAttachmentsRepository =
            new in_memory_check_ins_attachments_repository_1.InMemoryCheckInsAttachmentsRepository();
        inMemoryCheckInsRepository = new in_memory_check_ins_repository_1.InMemoryCheckInsRepository(inMemoryCheckInsAttachmentsRepository, inMemoryAttachmentsRepository, inMemoryCustomerRepository);
        inMemoryDeclarationModelsItemsRepository =
            new in_memory_declaration_model_items_repository_1.InMemoryDeclarationModelItemsRepository();
        inMemoryCustomsDeclarationItemsRepository =
            new in_memory_customs_declaration_items_repository_1.InMemoryCustomsDeclarationItemsRepository();
        inMemoryDeclarationModelsRepository =
            new in_memory_declaration_model_repository_1.InMemoryDeclarationModelsRepository(inMemoryDeclarationModelsItemsRepository);
        inMemoryShippingAddressRepository = new in_memory_shipping_address_repository_1.InMemoryShippingAddressRepository();
        inMemoryPackageShippingAddressRepository =
            new in_memory_package_shipping_address_repository_1.InMemoryPackageShippingAddressRepository(inMemoryShippingAddressRepository);
        inMemoryPackageRepository = new in_memory_package_repository_1.InMemoryPackageRepository(inMemoryCustomsDeclarationItemsRepository, inMemoryPackageShippingAddressRepository, inMemoryCheckInsRepository, inMemoryCustomerRepository);
        sut = new edit_package_1.EditPackagesUseCase(inMemoryPackageRepository, inMemoryDeclarationModelsItemsRepository, inMemoryPackageShippingAddressRepository);
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
        const packageCheckIns = [
            package_check_in_1.PackageCheckIn.create({
                checkInId: checkIn1.id,
                packageId: new unique_entity_id_1.UniqueEntityID('package-1'),
            }),
            package_check_in_1.PackageCheckIn.create({
                checkInId: checkIn2.id,
                packageId: new unique_entity_id_1.UniqueEntityID('package-1'),
            }),
        ];
        const newPkg = (0, make_package_1.makePackage)({
            shippingAddressId: new unique_entity_id_1.UniqueEntityID('shippingAddress-1'),
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcelForwarding-1'),
            hasBattery: false,
        }, new unique_entity_id_1.UniqueEntityID('package-1'));
        newPkg.checkIns = new package_check_ins_list_1.PackageCheckInsList(packageCheckIns);
        const customsDeclarationItems = (0, make_customs_declaration_items_1.makeCustomsDeclarationItems)(newPkg.id);
        newPkg.customsDeclarationList = new customs_declaration_list_1.CustomsDeclarationList(customsDeclarationItems);
        await inMemoryPackageRepository.create(newPkg);
    });
    it('should be able to edit a package', async () => {
        const shippingAddress2 = (0, make_shipping_address_1.makeShippingAddress)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
        }, new unique_entity_id_1.UniqueEntityID('shippingAddress-2'));
        await inMemoryShippingAddressRepository.create(shippingAddress2);
        const declarationModel = (0, make_declaration_model_with_items_1.makeDeclarationModelWithItems)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
            title: `Customs Declaration 2`,
        }, new unique_entity_id_1.UniqueEntityID('declaration-model-2'));
        inMemoryDeclarationModelsRepository.create(declarationModel);
        const result = await sut.execute({
            packageId: 'package-1',
            customerId: 'customer-1',
            shippingAddressId: 'shippingAddress-2',
            checkInsIds: ['check-in-3'],
            declarationModelId: 'declaration-model-2',
            hasBattery: true,
        });
        expect(result.isRight()).toBeTruthy();
        expect(inMemoryPackageShippingAddressRepository.items.length).toEqual(1);
        const itemsWithPackageId = inMemoryCheckInsRepository.items.filter((item) => item.packageId?.toString() === 'package-1');
        expect(itemsWithPackageId.length).toBe(1);
        expect(result.value).toEqual({
            package: expect.objectContaining({
                hasBattery: true,
                customsDeclarationList: expect.objectContaining({
                    currentItems: expect.arrayContaining([
                        expect.objectContaining({
                            description: 'Item 1',
                        }),
                        expect.objectContaining({
                            description: 'Item 2',
                        }),
                        expect.objectContaining({
                            description: 'Item 3',
                        }),
                    ]),
                }),
                checkIns: expect.objectContaining({
                    currentItems: expect.arrayContaining([
                        expect.objectContaining({
                            checkInId: new unique_entity_id_1.UniqueEntityID('check-in-3'),
                        }),
                    ]),
                }),
            }),
        });
    });
    it('should not be able to edit a package from another customer', async () => {
        const shippingAddress2 = (0, make_shipping_address_1.makeShippingAddress)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
        }, new unique_entity_id_1.UniqueEntityID('shippingAddress-2'));
        await inMemoryShippingAddressRepository.create(shippingAddress2);
        const declarationModel = (0, make_declaration_model_with_items_1.makeDeclarationModelWithItems)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
            title: `Customs Declaration 2`,
        }, new unique_entity_id_1.UniqueEntityID('declaration-model-2'));
        inMemoryDeclarationModelsRepository.create(declarationModel);
        const result = await sut.execute({
            packageId: 'package-1',
            customerId: 'customer-2',
            shippingAddressId: 'shippingAddress-2',
            checkInsIds: ['check-in-3'],
            declarationModelId: 'declaration-model-2',
            hasBattery: true,
        });
        expect(result.isLeft()).toBeTruthy();
    });
});
//# sourceMappingURL=edit-package.test.js.map