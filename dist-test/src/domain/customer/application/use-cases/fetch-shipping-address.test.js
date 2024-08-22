"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_shipping_address_repository_1 = require("../../../../../test/repositories/in-memory-shipping-address-repository");
const fetch_shipping_address_1 = require("./fetch-shipping-address");
const make_shipping_address_1 = require("../../../../../test/factories/make-shipping-address");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
let inMemoryShippingAddressRepository;
let sut;
describe('Get a Shipping Address', () => {
    beforeEach(() => {
        inMemoryShippingAddressRepository = new in_memory_shipping_address_repository_1.InMemoryShippingAddressRepository();
        sut = new fetch_shipping_address_1.FetchShippingAddressUseCase(inMemoryShippingAddressRepository);
    });
    it('should be able to fetch shipping addresses', async () => {
        const shippingAddress1 = (0, make_shipping_address_1.makeShippingAddress)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
        }, new unique_entity_id_1.UniqueEntityID('shipping-address-1'));
        const shippingAddress2 = (0, make_shipping_address_1.makeShippingAddress)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
        }, new unique_entity_id_1.UniqueEntityID('shippingAddress-2'));
        const shippingAddress3 = (0, make_shipping_address_1.makeShippingAddress)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-2'),
        }, new unique_entity_id_1.UniqueEntityID('address-3'));
        inMemoryShippingAddressRepository.items.push(shippingAddress1);
        inMemoryShippingAddressRepository.items.push(shippingAddress2);
        inMemoryShippingAddressRepository.items.push(shippingAddress3);
        const result = await sut.execute({
            customerId: 'customer-1',
        });
        expect(result.isRight()).toBeTruthy();
        expect(result.value
            .shippingAddresses.length).toEqual(2);
    });
    it('should not be able to fetch shipping addresses from another customer', async () => {
        const shippingAddress1 = (0, make_shipping_address_1.makeShippingAddress)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
        }, new unique_entity_id_1.UniqueEntityID('shipping-address-1'));
        const shippingAddress2 = (0, make_shipping_address_1.makeShippingAddress)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
        }, new unique_entity_id_1.UniqueEntityID('shippingAddress-2'));
        inMemoryShippingAddressRepository.items.push(shippingAddress1);
        inMemoryShippingAddressRepository.items.push(shippingAddress2);
        const result = await sut.execute({
            customerId: 'another-customer',
        });
        expect(result.isLeft()).toBeTruthy();
    });
});
//# sourceMappingURL=fetch-shipping-address.test.js.map