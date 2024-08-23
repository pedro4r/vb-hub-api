"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageCreatedEvent = void 0;
class PackageCreatedEvent {
    ocurredAt;
    pkg;
    constructor(pkg) {
        this.pkg = pkg;
        this.ocurredAt = new Date();
    }
    getAggregateId() {
        return this.pkg.id;
    }
}
exports.PackageCreatedEvent = PackageCreatedEvent;
//# sourceMappingURL=package-created-event.js.map