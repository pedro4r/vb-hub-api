"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const in_memory_customer_repository_1 = require("../../../../../test/repositories/in-memory-customer-repository");
const make_customer_1 = require("../../../../../test/factories/make-customer");
const fetch_customers_by_name_1 = require("./fetch-customers-by-name");
let inMemoryCustomerRepository;
let sut;
describe('Fetch Customers By Name', () => {
    beforeEach(() => {
        inMemoryCustomerRepository = new in_memory_customer_repository_1.InMemoryCustomerRepository();
        sut = new fetch_customers_by_name_1.FetchCustomersByNameUseCase(inMemoryCustomerRepository);
    });
    it('should be able to fetch customers by name', async () => {
        const customer1 = (0, make_customer_1.makeCustomer)({
            firstName: 'John',
            lastName: 'Doe',
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('company-1'),
        }, new unique_entity_id_1.UniqueEntityID('customer-1'));
        const customer2 = (0, make_customer_1.makeCustomer)({
            firstName: 'Jane',
            lastName: 'Doe',
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('company-1'),
        }, new unique_entity_id_1.UniqueEntityID('customer-1'));
        await inMemoryCustomerRepository.create(customer1);
        await inMemoryCustomerRepository.create(customer2);
        const result = await sut.execute({
            name: 'do',
            page: 1,
            parcelForwardingId: 'company-1',
        });
        expect(result.isRight()).toBe(true);
        expect(result.value).toEqual({
            customersData: expect.objectContaining({
                customers: expect.arrayContaining([
                    expect.objectContaining({
                        firstName: 'John',
                        lastName: 'Doe',
                    }),
                    expect.objectContaining({
                        firstName: 'Jane',
                        lastName: 'Doe',
                    }),
                ]),
                meta: expect.objectContaining({
                    pageIndex: 1,
                    perPage: 5,
                    totalCount: 2,
                }),
            }),
        });
        const result2 = await sut.execute({
            name: 'jo',
            page: 1,
            parcelForwardingId: 'company-1',
        });
        expect(result2.value).toEqual({
            customersData: expect.objectContaining({
                customers: expect.arrayContaining([
                    expect.objectContaining({
                        firstName: 'John',
                        lastName: 'Doe',
                    }),
                ]),
                meta: expect.objectContaining({
                    pageIndex: 1,
                    perPage: 5,
                    totalCount: 1,
                }),
            }),
        });
    });
    it('should not be able to fetch customers by name with another parcelForwardingId', async () => {
        const customer1 = (0, make_customer_1.makeCustomer)({
            firstName: 'John',
            lastName: 'Doe',
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('company-1'),
        }, new unique_entity_id_1.UniqueEntityID('customer-1'));
        const customer2 = (0, make_customer_1.makeCustomer)({
            firstName: 'Jane',
            lastName: 'Doe',
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('company-1'),
        }, new unique_entity_id_1.UniqueEntityID('customer-1'));
        await inMemoryCustomerRepository.create(customer1);
        await inMemoryCustomerRepository.create(customer2);
        const result = await sut.execute({
            name: 'do',
            page: 1,
            parcelForwardingId: 'company-2',
        });
        expect(result.isLeft()).toBe(true);
    });
});
//# sourceMappingURL=fetch-customers-by-name.test.js.map