"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const send_notification_1 = require("../use-cases/send-notification");
const in_memory_notifications_repository_1 = require("../../../../../test/repositories/in-memory-notifications-repository");
const wait_for_1 = require("../../../../../test/utils/wait-for");
const in_memory_package_repository_1 = require("../../../../../test/repositories/in-memory-package-repository");
const on_package_created_1 = require("./on-package-created");
const make_package_1 = require("../../../../../test/factories/make-package");
const in_memory_package_shipping_address_repository_1 = require("../../../../../test/repositories/in-memory-package-shipping-address-repository");
const in_memory_shipping_address_repository_1 = require("../../../../../test/repositories/in-memory-shipping-address-repository");
const in_memory_customs_declaration_items_repository_1 = require("../../../../../test/repositories/in-memory-customs-declaration-items-repository");
const in_memory_check_ins_attachments_repository_1 = require("../../../../../test/repositories/in-memory-check-ins-attachments-repository");
const in_memory_check_ins_repository_1 = require("../../../../../test/repositories/in-memory-check-ins-repository");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const package_check_ins_list_1 = require("../../../customer/enterprise/entities/package-check-ins-list");
const make_customs_declaration_items_1 = require("../../../../../test/factories/make-customs-declaration-items");
const customs_declaration_list_1 = require("../../../customer/enterprise/entities/customs-declaration-list");
const make_shipping_address_1 = require("../../../../../test/factories/make-shipping-address");
const make_check_in_1 = require("../../../../../test/factories/make-check-in");
const package_check_in_1 = require("../../../customer/enterprise/entities/package-check-in");
const in_memory_customer_repository_1 = require("../../../../../test/repositories/in-memory-customer-repository");
const in_memory_attachments_repository_1 = require("../../../../../test/repositories/in-memory-attachments-repository");
let inMemoryCustomerRepository;
let inMemoryAttachmentsRepository;
let inMemoryCheckInsAttachmentsRepository;
let inMemoryCheckInsRepository;
let inMemoryCustomsDeclarationItemsRepository;
let inMemoryShippingAddressRepository;
let inMemoryPackageShippingAddressRepository;
let inMemoryNotificationsRepository;
let inMemoryPackageRepository;
let sendNotificationUseCase;
let sendNotificationExecuteSpy;
describe('On Check-in Created', () => {
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
        inMemoryNotificationsRepository = new in_memory_notifications_repository_1.InMemoryNotificationsRepository();
        sendNotificationUseCase = new send_notification_1.SendNotificationUseCase(inMemoryNotificationsRepository);
        sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');
        new on_package_created_1.OnPackageCreated(inMemoryPackageRepository, sendNotificationUseCase);
    });
    it('should send a notification when a package is created', async () => {
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
        const newPkg = (0, make_package_1.makePackage)({
            shippingAddressId: new unique_entity_id_1.UniqueEntityID('shippingAddress-1'),
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcelForwarding-1'),
            hasBattery: false,
        });
        const packageCheckIns = [
            package_check_in_1.PackageCheckIn.create({
                checkInId: checkIn1.id,
                packageId: newPkg.id,
            }),
            package_check_in_1.PackageCheckIn.create({
                checkInId: checkIn2.id,
                packageId: newPkg.id,
            }),
        ];
        newPkg.checkIns = new package_check_ins_list_1.PackageCheckInsList(packageCheckIns);
        const customsDeclarationItems = (0, make_customs_declaration_items_1.makeCustomsDeclarationItems)(newPkg.id);
        newPkg.customsDeclarationList = new customs_declaration_list_1.CustomsDeclarationList(customsDeclarationItems);
        await inMemoryPackageRepository.create(newPkg);
        await (0, wait_for_1.waitFor)(() => {
            expect(sendNotificationExecuteSpy).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=on-package-created.test.js.map