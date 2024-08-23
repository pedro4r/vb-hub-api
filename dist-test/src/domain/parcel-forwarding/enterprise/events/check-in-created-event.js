"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInCreatedEvent = void 0;
class CheckInCreatedEvent {
    ocurredAt;
    checkIn;
    constructor(checkIn) {
        this.checkIn = checkIn;
        this.ocurredAt = new Date();
    }
    getAggregateId() {
        return this.checkIn.id;
    }
}
exports.CheckInCreatedEvent = CheckInCreatedEvent;
//# sourceMappingURL=check-in-created-event.js.map