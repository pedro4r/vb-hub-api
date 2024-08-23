"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnCheckInCreated = void 0;
const domain_events_1 = require("../../../../core/events/domain-events");
const check_in_created_event_1 = require("../../../parcel-forwarding/enterprise/events/check-in-created-event");
class OnCheckInCreated {
    checkInsRepository;
    sendNotification;
    constructor(checkInsRepository, sendNotification) {
        this.checkInsRepository = checkInsRepository;
        this.sendNotification = sendNotification;
        this.setupSubscriptions();
    }
    setupSubscriptions() {
        domain_events_1.DomainEvents.register(this.sendNewCheckInNotification.bind(this), check_in_created_event_1.CheckInCreatedEvent.name);
    }
    async sendNewCheckInNotification({ checkIn }) {
        await this.sendNotification.execute({
            recipientId: checkIn.customerId.toString(),
            title: `Encomenda recebida ${checkIn.id.toString()}!`,
            content: `Veja as informações da sua encomenda`,
        });
    }
}
exports.OnCheckInCreated = OnCheckInCreated;
//# sourceMappingURL=on-check-in-created.js.map