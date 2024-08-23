"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aggregate_root_1 = require("../entities/aggregate-root");
const domain_events_1 = require("./domain-events");
const vitest_1 = require("vitest");
class CustomAggregateCreated {
    ocurredAt;
    aggregate;
    constructor(aggregate) {
        this.aggregate = aggregate;
        this.ocurredAt = new Date();
    }
    getAggregateId() {
        return this.aggregate.id;
    }
}
class CustomAggregate extends aggregate_root_1.AggregateRoot {
    static create() {
        const aggregate = new CustomAggregate(null);
        aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));
        return aggregate;
    }
}
describe('domain events', () => {
    it('should be able to dispatch and listen to events', async () => {
        const callbackSpy = vitest_1.vi.fn();
        domain_events_1.DomainEvents.register(callbackSpy, CustomAggregateCreated.name);
        const aggregate = CustomAggregate.create();
        expect(aggregate.domainEvents).toHaveLength(1);
        domain_events_1.DomainEvents.dispatchEventsForAggregate(aggregate.id);
        expect(callbackSpy).toHaveBeenCalled();
        expect(aggregate.domainEvents).toHaveLength(0);
    });
});
//# sourceMappingURL=domain-events.test.js.map