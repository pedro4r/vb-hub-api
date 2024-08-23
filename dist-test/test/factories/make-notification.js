"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeNotification = makeNotification;
const faker_1 = require("@faker-js/faker");
const unique_entity_id_1 = require("../../src/core/entities/unique-entity-id");
const notification_1 = require("../../src/domain/notifications/enterprise/entities/notification");
function makeNotification(override = {}, id) {
    const notification = notification_1.Notification.create({
        recipientId: new unique_entity_id_1.UniqueEntityID(),
        title: faker_1.faker.lorem.sentence(4),
        content: faker_1.faker.lorem.sentence(10),
        ...override,
    }, id);
    return notification;
}
//# sourceMappingURL=make-notification.js.map