"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnFirstShippingAddressCreated = void 0;
const domain_events_1 = require("../../../../core/events/domain-events");
const first_address_created_event_1 = require("../../../customer/enterprise/events/first-address-created-event");
class OnFirstShippingAddressCreated {
    shippingAddressRepository;
    sendNotification;
    constructor(shippingAddressRepository, sendNotification) {
        this.shippingAddressRepository = shippingAddressRepository;
        this.sendNotification = sendNotification;
        this.setupSubscriptions();
    }
    setupSubscriptions() {
        domain_events_1.DomainEvents.register(this.sendCustomerHubCreatedNotification.bind(this), first_address_created_event_1.FirstShippingAddressCreatedEvent.name);
    }
    async sendCustomerHubCreatedNotification({ shippingAddress, }) {
        await this.sendNotification.execute({
            recipientId: shippingAddress.customerId.toString(),
            title: `O endereço do seu Hub já foi criado!`,
            content: `Veja como usar o seu Hub!`,
        });
    }
}
exports.OnFirstShippingAddressCreated = OnFirstShippingAddressCreated;
//# sourceMappingURL=on-first-shipping-address-created.js.map