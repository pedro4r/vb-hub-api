"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_package_repository_1 = require("../../../../../test/repositories/in-memory-package-repository");
const make_package_1 = require("../../../../../test/factories/make-package");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const in_memory_package_shipping_address_repository_1 = require("../../../../../test/repositories/in-memory-package-shipping-address-repository");
const in_memory_check_ins_attachments_repository_1 = require("../../../../../test/repositories/in-memory-check-ins-attachments-repository");
const in_memory_check_ins_repository_1 = require("../../../../../test/repositories/in-memory-check-ins-repository");
const in_memory_customs_declaration_items_repository_1 = require("../../../../../test/repositories/in-memory-customs-declaration-items-repository");
const in_memory_shipping_address_repository_1 = require("../../../../../test/repositories/in-memory-shipping-address-repository");
const make_customs_declaration_items_1 = require("../../../../../test/factories/make-customs-declaration-items");
const make_shipping_address_1 = require("../../../../../test/factories/make-shipping-address");
const make_check_in_1 = require("../../../../../test/factories/make-check-in");
const in_memory_customer_repository_1 = require("../../../../../test/repositories/in-memory-customer-repository");
const in_memory_attachments_repository_1 = require("../../../../../test/repositories/in-memory-attachments-repository");
const package_check_in_1 = require("../../../customer/enterprise/entities/package-check-in");
const package_check_ins_list_1 = require("../../../customer/enterprise/entities/package-check-ins-list");
const customs_declaration_list_1 = require("../../../customer/enterprise/entities/customs-declaration-list");
const make_customer_1 = require("../../../../../test/factories/make-customer");
const get_package_check_ins_details_1 = require("./get-package-check-ins-details");
const make_attachment_1 = require("../../../../../test/factories/make-attachment");
const make_check_in_attachment_1 = require("../../../../../test/factories/make-check-in-attachment");
let inMemoryCustomerRepository;
let inMemoryAttachmentsRepository;
let inMemoryCheckInsAttachmentsRepository;
let inMemoryCheckInsRepository;
let inMemoryCustomsDeclarationItemsRepository;
let inMemoryShippingAddressRepository;
let inMemoryPackageShippingAddressRepository;
let inMemoryPackageRepository;
let sut;
describe('Get a Package Check-ins Details', () => {
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
        sut = new get_package_check_ins_details_1.GetPackageCheckInsDetailsUseCase(inMemoryCheckInsRepository);
        const customer = (0, make_customer_1.makeCustomer)({}, new unique_entity_id_1.UniqueEntityID('customer-1'));
        await inMemoryCustomerRepository.create(customer);
        const shippingAddress = (0, make_shipping_address_1.makeShippingAddress)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
        }, new unique_entity_id_1.UniqueEntityID('shippingAddress-1'));
        await inMemoryShippingAddressRepository.create(shippingAddress);
        inMemoryAttachmentsRepository.items.push((0, make_attachment_1.makeAttachment)({}, new unique_entity_id_1.UniqueEntityID('attachment-1')), (0, make_attachment_1.makeAttachment)({}, new unique_entity_id_1.UniqueEntityID('attachment-2')), (0, make_attachment_1.makeAttachment)({}, new unique_entity_id_1.UniqueEntityID('attachment-3')));
        const checkIn1 = (0, make_check_in_1.makeCheckIn)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcelForwarding-1'),
        }, new unique_entity_id_1.UniqueEntityID('check-in-1'));
        const checkIn2 = (0, make_check_in_1.makeCheckIn)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcelForwarding-1'),
        }, new unique_entity_id_1.UniqueEntityID('check-in-2'));
        inMemoryCheckInsAttachmentsRepository.items.push((0, make_check_in_attachment_1.makeCheckInAttachment)({
            checkInId: checkIn1.id,
            attachmentId: new unique_entity_id_1.UniqueEntityID('attachment-1'),
        }), (0, make_check_in_attachment_1.makeCheckInAttachment)({
            checkInId: checkIn1.id,
            attachmentId: new unique_entity_id_1.UniqueEntityID('attachment-2'),
        }), (0, make_check_in_attachment_1.makeCheckInAttachment)({
            checkInId: checkIn2.id,
            attachmentId: new unique_entity_id_1.UniqueEntityID('attachment-3'),
        }));
        await inMemoryCheckInsRepository.create(checkIn1);
        await inMemoryCheckInsRepository.create(checkIn2);
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
    it('should be able to get a package check-ins details', async () => {
        expect(inMemoryPackageShippingAddressRepository.items.length).toBe(1);
        expect(inMemoryCustomsDeclarationItemsRepository.items.length).toBe(3);
        const result = await sut.execute({
            parcelForwardingId: 'parcelForwarding-1',
            packageId: 'package-1',
            page: 1,
        });
        expect(result.isRight()).toBeTruthy();
        expect(result.value).toEqual({
            checkInsDetails: expect.arrayContaining([
                expect.objectContaining({
                    checkInId: new unique_entity_id_1.UniqueEntityID('check-in-1'),
                    hubId: expect.any(Number),
                    customerFirstName: expect.any(String),
                    customerLastName: expect.any(String),
                    status: expect.any(String),
                }),
            ]),
        });
    });
    it('should not be able to get a package details from another parcel forwarding company', async () => {
        const result = await sut.execute({
            parcelForwardingId: 'parcelForwarding-2',
            packageId: 'package-1',
            page: 1,
        });
        expect(result.isLeft()).toBeTruthy();
    });
});
//# sourceMappingURL=get-package-check-ins-details.test.js.map