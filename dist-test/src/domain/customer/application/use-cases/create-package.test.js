"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_package_repository_1 = require("../../../../../test/repositories/in-memory-package-repository");
const create_package_1 = require("./create-package");
const in_memory_customs_declaration_items_repository_1 = require("../../../../../test/repositories/in-memory-customs-declaration-items-repository");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const declaration_model_list_1 = require("../../enterprise/entities/declaration-model-list");
const in_memory_declaration_model_repository_1 = require("../../../../../test/repositories/in-memory-declaration-model-repository");
const in_memory_declaration_model_items_repository_1 = require("../../../../../test/repositories/in-memory-declaration-model-items-repository");
const in_memory_check_ins_repository_1 = require("../../../../../test/repositories/in-memory-check-ins-repository");
const in_memory_check_ins_attachments_repository_1 = require("../../../../../test/repositories/in-memory-check-ins-attachments-repository");
const make_check_in_1 = require("../../../../../test/factories/make-check-in");
const in_memory_package_shipping_address_repository_1 = require("../../../../../test/repositories/in-memory-package-shipping-address-repository");
const in_memory_shipping_address_repository_1 = require("../../../../../test/repositories/in-memory-shipping-address-repository");
const make_shipping_address_1 = require("../../../../../test/factories/make-shipping-address");
const make_declaration_model_item_1 = require("../../../../../test/factories/make-declaration-model-item");
const make_declaration_model_1 = require("../../../../../test/factories/make-declaration-model");
const in_memory_customer_repository_1 = require("../../../../../test/repositories/in-memory-customer-repository");
const in_memory_attachments_repository_1 = require("../../../../../test/repositories/in-memory-attachments-repository");
let inMemoryCustomerRepository;
let inMemoryAttachmentsRepository;
let inMemoryCheckInsAttachmentsRepository;
let inMemoryCheckInsRepository;
let inMemoryDeclarationModelsItemsRepository;
let inMemoryDeclarationModelsRepository;
let inMemoryCustomsDeclarationItemsRepository;
let inMemoryShippingAddressRepository;
let inMemoryPackageShippingAddressRepository;
let inMemoryPackageRepository;
let sut;
describe('Create Package', () => {
    beforeEach(async () => {
        inMemoryCustomerRepository = new in_memory_customer_repository_1.InMemoryCustomerRepository();
        inMemoryAttachmentsRepository = new in_memory_attachments_repository_1.InMemoryAttachmentsRepository();
        inMemoryCheckInsAttachmentsRepository =
            new in_memory_check_ins_attachments_repository_1.InMemoryCheckInsAttachmentsRepository();
        inMemoryCheckInsRepository = new in_memory_check_ins_repository_1.InMemoryCheckInsRepository(inMemoryCheckInsAttachmentsRepository, inMemoryAttachmentsRepository, inMemoryCustomerRepository);
        inMemoryDeclarationModelsItemsRepository =
            new in_memory_declaration_model_items_repository_1.InMemoryDeclarationModelItemsRepository();
        inMemoryDeclarationModelsRepository =
            new in_memory_declaration_model_repository_1.InMemoryDeclarationModelsRepository(inMemoryDeclarationModelsItemsRepository);
        inMemoryCustomsDeclarationItemsRepository =
            new in_memory_customs_declaration_items_repository_1.InMemoryCustomsDeclarationItemsRepository();
        inMemoryShippingAddressRepository = new in_memory_shipping_address_repository_1.InMemoryShippingAddressRepository();
        inMemoryPackageShippingAddressRepository =
            new in_memory_package_shipping_address_repository_1.InMemoryPackageShippingAddressRepository(inMemoryShippingAddressRepository);
        inMemoryPackageRepository = new in_memory_package_repository_1.InMemoryPackageRepository(inMemoryCustomsDeclarationItemsRepository, inMemoryPackageShippingAddressRepository, inMemoryCheckInsRepository, inMemoryCustomerRepository);
        sut = new create_package_1.CreatePackageUseCase(inMemoryPackageRepository, inMemoryDeclarationModelsItemsRepository);
        await Promise.all(new Array(2).fill(null).map(async (_, i) => {
            const declarationModel = (0, make_declaration_model_1.makeDeclarationModel)({
                customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
                title: `Customs Declaration ${i + 1}`,
            }, new unique_entity_id_1.UniqueEntityID(`declaration-model-${i + 1}`));
            const declarationModelsItems = [
                (0, make_declaration_model_item_1.makeDeclarationModelItem)({
                    declarationModelId: declarationModel.id,
                }),
                (0, make_declaration_model_item_1.makeDeclarationModelItem)({
                    declarationModelId: declarationModel.id,
                }),
                (0, make_declaration_model_item_1.makeDeclarationModelItem)({
                    declarationModelId: declarationModel.id,
                }),
            ];
            declarationModel.items = new declaration_model_list_1.DeclarationModelList(declarationModelsItems);
            return await inMemoryDeclarationModelsRepository.create(declarationModel);
        }));
        const shippingAddress = (0, make_shipping_address_1.makeShippingAddress)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
        }, new unique_entity_id_1.UniqueEntityID('shippingAddress-1'));
        await inMemoryShippingAddressRepository.create(shippingAddress);
        const checkIn1 = (0, make_check_in_1.makeCheckIn)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcelForwarding-1'),
        }, new unique_entity_id_1.UniqueEntityID('check-in-1'));
        const checkIn2 = (0, make_check_in_1.makeCheckIn)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcelForwarding-1'),
        }, new unique_entity_id_1.UniqueEntityID('check-in-2'));
        await inMemoryCheckInsRepository.create(checkIn1);
        await inMemoryCheckInsRepository.create(checkIn2);
    });
    it('should be able to create a package', async () => {
        const result = await sut.execute({
            customerId: 'customer-1',
            parcelForwardingId: 'parcelForwarding-1',
            shippingAddressId: 'shippingAddress-1',
            checkInsIds: ['check-in-1', 'check-in-2'],
            declarationModelId: 'declaration-model-1',
            hasBattery: true,
        });
        expect(result.isRight()).toBe(true);
        const packageId = result.value.pkg.id;
        expect(result.value.pkg).toEqual(expect.objectContaining({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcelForwarding-1'),
            checkIns: expect.objectContaining({
                initial: expect.arrayContaining([
                    expect.objectContaining({
                        checkInId: new unique_entity_id_1.UniqueEntityID('check-in-1'),
                        packageId,
                    }),
                    expect.objectContaining({
                        checkInId: new unique_entity_id_1.UniqueEntityID('check-in-2'),
                        packageId,
                    }),
                ]),
            }),
            hasBattery: true,
        }));
        expect(inMemoryPackageRepository.items.length).toEqual(1);
        expect(inMemoryCheckInsRepository.items.length).toEqual(2);
        expect(inMemoryCustomsDeclarationItemsRepository.items.length).toEqual(3);
        expect(inMemoryDeclarationModelsRepository.items.length).toBe(2);
        expect(inMemoryDeclarationModelsItemsRepository.items.length).toBe(6);
        expect(inMemoryPackageShippingAddressRepository.items.length).toBe(1);
    });
});
//# sourceMappingURL=create-package.test.js.map