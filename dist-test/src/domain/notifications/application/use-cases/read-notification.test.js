"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_notifications_repository_1 = require("../../../../../test/repositories/in-memory-notifications-repository");
const read_notification_1 = require("./read-notification");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const not_allowed_error_1 = require("../../../../core/errors/errors/not-allowed-error");
const make_notification_1 = require("../../../../../test/factories/make-notification");
let inMemoryNotificationsRepository;
let sut;
describe('Send Notification', () => {
    beforeEach(() => {
        inMemoryNotificationsRepository = new in_memory_notifications_repository_1.InMemoryNotificationsRepository();
        sut = new read_notification_1.ReadNotificationUseCase(inMemoryNotificationsRepository);
    });
    it('should be able to read a notification', async () => {
        const notification = (0, make_notification_1.makeNotification)();
        inMemoryNotificationsRepository.create(notification);
        const result = await sut.execute({
            recipientId: notification.recipientId.toString(),
            notificationId: notification.id.toString(),
        });
        expect(result.isRight()).toBe(true);
        expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(expect.any(Date));
    });
    it('should not be able to read a notification from another user', async () => {
        const notification = (0, make_notification_1.makeNotification)({
            recipientId: new unique_entity_id_1.UniqueEntityID('recipient-1'),
        });
        inMemoryNotificationsRepository.create(notification);
        const result = await sut.execute({
            notificationId: notification.id.toString(),
            recipientId: 'recipient-2',
        });
        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(not_allowed_error_1.NotAllowedError);
    });
});
//# sourceMappingURL=read-notification.test.js.map