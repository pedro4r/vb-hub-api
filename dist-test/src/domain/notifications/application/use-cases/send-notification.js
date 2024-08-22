"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendNotificationUseCase = void 0;
const either_1 = require("../../../../core/either");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const notification_1 = require("../../enterprise/entities/notification");
class SendNotificationUseCase {
    notificationsRepository;
    constructor(notificationsRepository) {
        this.notificationsRepository = notificationsRepository;
    }
    async execute({ recipientId, title, content, }) {
        const notification = notification_1.Notification.create({
            recipientId: new unique_entity_id_1.UniqueEntityID(recipientId),
            title,
            content,
        });
        await this.notificationsRepository.create(notification);
        return (0, either_1.right)({
            notification,
        });
    }
}
exports.SendNotificationUseCase = SendNotificationUseCase;
//# sourceMappingURL=send-notification.js.map