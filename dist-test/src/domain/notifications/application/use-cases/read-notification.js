"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadNotificationUseCase = void 0;
const either_1 = require("../../../../core/either");
const not_allowed_error_1 = require("../../../../core/errors/errors/not-allowed-error");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
class ReadNotificationUseCase {
    notificationsRepository;
    constructor(notificationsRepository) {
        this.notificationsRepository = notificationsRepository;
    }
    async execute({ recipientId, notificationId, }) {
        const notification = await this.notificationsRepository.findById(notificationId);
        if (!notification) {
            return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError());
        }
        if (recipientId !== notification.recipientId.toString()) {
            return (0, either_1.left)(new not_allowed_error_1.NotAllowedError());
        }
        notification.read();
        await this.notificationsRepository.save(notification);
        return (0, either_1.right)({ notification });
    }
}
exports.ReadNotificationUseCase = ReadNotificationUseCase;
//# sourceMappingURL=read-notification.js.map