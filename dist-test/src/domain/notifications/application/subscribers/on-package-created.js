"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnPackageCreated = void 0;
const domain_events_1 = require("../../../../core/events/domain-events");
const package_created_event_1 = require("../../../customer/enterprise/events/package-created-event");
class OnPackageCreated {
    packageRepository;
    sendNotification;
    constructor(packageRepository, sendNotification) {
        this.packageRepository = packageRepository;
        this.sendNotification = sendNotification;
        this.setupSubscriptions();
    }
    setupSubscriptions() {
        domain_events_1.DomainEvents.register(this.sendNewPackageNotification.bind(this), package_created_event_1.PackageCreatedEvent.name);
    }
    async sendNewPackageNotification({ pkg }) {
        await this.sendNotification.execute({
            recipientId: pkg.parcelForwardingId.toString(),
            title: `Requisicao de envio`,
            content: `Voce tem uma nova requisicao de envio de pacote!`,
        });
    }
}
exports.OnPackageCreated = OnPackageCreated;
//# sourceMappingURL=on-package-created.js.map