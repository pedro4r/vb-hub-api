"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryNotificationsRepository = void 0;
class InMemoryNotificationsRepository {
    items = [];
    async findById(id) {
        const notification = this.items.find((item) => item.id.toString() === id);
        if (!notification) {
            return null;
        }
        return notification;
    }
    async create(notification) {
        this.items.push(notification);
    }
    async save(notification) {
        const itemIndex = this.items.findIndex((item) => item.id === notification.id);
        this.items[itemIndex] = notification;
    }
}
exports.InMemoryNotificationsRepository = InMemoryNotificationsRepository;
//# sourceMappingURL=in-memory-notifications-repository.js.map