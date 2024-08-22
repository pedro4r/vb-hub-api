"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_check_ins_repository_1 = require("../../../../../test/repositories/in-memory-check-ins-repository");
const send_notification_1 = require("../use-cases/send-notification");
const in_memory_notifications_repository_1 = require("../../../../../test/repositories/in-memory-notifications-repository");
const in_memory_check_ins_attachments_repository_1 = require("../../../../../test/repositories/in-memory-check-ins-attachments-repository");
const on_check_in_created_1 = require("./on-check-in-created");
const make_check_in_1 = require("../../../../../test/factories/make-check-in");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const wait_for_1 = require("../../../../../test/utils/wait-for");
const in_memory_customer_repository_1 = require("../../../../../test/repositories/in-memory-customer-repository");
const in_memory_attachments_repository_1 = require("../../../../../test/repositories/in-memory-attachments-repository");
let inMemoryCustomerRepository;
let inMemoryAttachmentsRepository;
let inMemoryCheckInsRepository;
let inMemoryCheckInsAttachmentsRepository;
let inMemoryNotificationsRepository;
let sendNotificationUseCase;
let sendNotificationExecuteSpy;
describe('On Check-in Created', () => {
    beforeEach(() => {
        inMemoryCustomerRepository = new in_memory_customer_repository_1.InMemoryCustomerRepository();
        inMemoryAttachmentsRepository = new in_memory_attachments_repository_1.InMemoryAttachmentsRepository();
        inMemoryCheckInsAttachmentsRepository =
            new in_memory_check_ins_attachments_repository_1.InMemoryCheckInsAttachmentsRepository();
        inMemoryCheckInsRepository = new in_memory_check_ins_repository_1.InMemoryCheckInsRepository(inMemoryCheckInsAttachmentsRepository, inMemoryAttachmentsRepository, inMemoryCustomerRepository);
        inMemoryNotificationsRepository = new in_memory_notifications_repository_1.InMemoryNotificationsRepository();
        sendNotificationUseCase = new send_notification_1.SendNotificationUseCase(inMemoryNotificationsRepository);
        sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');
        new on_check_in_created_1.OnCheckInCreated(inMemoryCheckInsRepository, sendNotificationUseCase);
    });
    it('should send a notification when a check-in is created', async () => {
        const checkIn = (0, make_check_in_1.makeCheckIn)({
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('company-1'),
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
        });
        inMemoryCheckInsRepository.create(checkIn);
        await (0, wait_for_1.waitFor)(() => {
            expect(sendNotificationExecuteSpy).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=on-check-in-created.test.js.map