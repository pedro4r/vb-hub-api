"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unique_entity_id_1 = require("../../../../../core/entities/unique-entity-id");
const customer_hub_address_1 = require("./customer-hub-address");
const make_forwarding_address_1 = require("../../../../../../test/factories/make-forwarding-address");
describe('Create Customer Hub Address', () => {
    it('should be able to create a new customer hub address', async () => {
        const parcelForwardingAddress = (0, make_forwarding_address_1.makeParcelForwardingAddress)();
        const hubAddress = customer_hub_address_1.CustomerHubAddress.create({
            customerHubId: 12,
            parcelForwardingAddress,
        });
        expect(hubAddress).toEqual(expect.objectContaining({
            customerHubId: expect.any(Number),
            parcelForwardingAddress: expect.objectContaining({
                id: expect.any(unique_entity_id_1.UniqueEntityID),
            }),
        }));
    });
});
//# sourceMappingURL=customer-hub-address.test.js.map