"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const in_memory_customer_repository_1 = require("../../../../../test/repositories/in-memory-customer-repository");
const make_customer_1 = require("../../../../../test/factories/make-customer");
const get_customer_by_hub_id_1 = require("./get-customer-by-hub-id");
let inMemoryCustomerRepository;
let sut;
describe('Get Customer By HubId', () => {
    beforeEach(() => {
        inMemoryCustomerRepository = new in_memory_customer_repository_1.InMemoryCustomerRepository();
        sut = new get_customer_by_hub_id_1.GetCustomerByHubIdUseCase(inMemoryCustomerRepository);
    });
    it('should be able to get a customer by HubId', async () => {
        const customer = (0, make_customer_1.makeCustomer)({
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('company-1'),
        }, new unique_entity_id_1.UniqueEntityID('customer-1'));
        await inMemoryCustomerRepository.create(customer);
        const result = await sut.execute({
            hubId: customer.hubId,
            parcelForwardingId: 'company-1',
        });
        expect(result.value).toEqual({
            customerPreview: expect.objectContaining({
                customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
                firstName: expect.any(String),
            }),
        });
        expect(inMemoryCustomerRepository.items).toHaveLength(1);
    });
});
//# sourceMappingURL=get-customer-by-hub-id.test.js.map