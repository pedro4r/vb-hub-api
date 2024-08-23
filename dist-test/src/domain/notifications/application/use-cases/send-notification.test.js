"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_notifications_repository_1 = require("../../../../../test/repositories/in-memory-notifications-repository");
const send_notification_1 = require("./send-notification");
let inMemoryNotificationRepository;
let sut;
describe('Send Notifications', () => {
    beforeEach(() => {
        inMemoryNotificationRepository = new in_memory_notifications_repository_1.InMemoryNotificationsRepository();
        sut = new send_notification_1.SendNotificationUseCase(inMemoryNotificationRepository);
    });
    it('should be able to send a notification', async () => {
        const result = await sut.execute({
            recipientId: '1',
            title: 'New notification',
            content: 'New notification content',
        });
        expect(result.isRight()).toBe(true);
        expect(inMemoryNotificationRepository.items[0]).toEqual(result.value?.notification);
    });
});
//# sourceMappingURL=send-notification.test.js.map