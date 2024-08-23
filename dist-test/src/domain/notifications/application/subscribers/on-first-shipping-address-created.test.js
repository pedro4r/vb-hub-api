"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_notifications_repository_1 = require("../../../../../test/repositories/in-memory-notifications-repository");
const in_memory_shipping_address_repository_1 = require("../../../../../test/repositories/in-memory-shipping-address-repository");
const send_notification_1 = require("../use-cases/send-notification");
const on_first_shipping_address_created_1 = require("./on-first-shipping-address-created");
const make_shipping_address_1 = require("../../../../../test/factories/make-shipping-address");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const wait_for_1 = require("../../../../../test/utils/wait-for");
let inMemoryShippingAddressRepository;
let inMemoryNotificationsRepository;
let sendNotificationUseCase;
let sendNotificationExecuteSpy;
describe('On First Shipping Address Created', () => {
    beforeEach(() => {
        inMemoryShippingAddressRepository = new in_memory_shipping_address_repository_1.InMemoryShippingAddressRepository();
        inMemoryNotificationsRepository = new in_memory_notifications_repository_1.InMemoryNotificationsRepository();
        sendNotificationUseCase = new send_notification_1.SendNotificationUseCase(inMemoryNotificationsRepository);
        sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');
        new on_first_shipping_address_created_1.OnFirstShippingAddressCreated(inMemoryShippingAddressRepository, sendNotificationUseCase);
    });
    it('should send a notification when a check-in is created', async () => {
        const shippingAddress = (0, make_shipping_address_1.makeShippingAddress)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
        });
        inMemoryShippingAddressRepository.create(shippingAddress);
        await (0, wait_for_1.waitFor)(() => {
            expect(sendNotificationExecuteSpy).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=on-first-shipping-address-created.test.js.map