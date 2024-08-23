"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_shipping_address_repository_1 = require("../../../../../test/repositories/in-memory-shipping-address-repository");
const make_shipping_address_1 = require("../../../../../test/factories/make-shipping-address");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const get_shipping_address_1 = require("./get-shipping-address");
let inMemoryShippingAddressRepository;
let sut;
describe('Get a Shipping Address', () => {
    beforeEach(() => {
        inMemoryShippingAddressRepository = new in_memory_shipping_address_repository_1.InMemoryShippingAddressRepository();
        sut = new get_shipping_address_1.GetShippingAddressUseCase(inMemoryShippingAddressRepository);
    });
    it('should be able to get a shipping address', async () => {
        const shippingAddress = (0, make_shipping_address_1.makeShippingAddress)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
        }, new unique_entity_id_1.UniqueEntityID('shipping-address-1'));
        inMemoryShippingAddressRepository.items.push(shippingAddress);
        const result = await sut.execute({
            customerId: shippingAddress.customerId.toString(),
            shippingAddressId: shippingAddress.id.toString(),
        });
        expect(result.isRight()).toBeTruthy();
        expect(inMemoryShippingAddressRepository.items[0].address).toMatchObject({
            zipcode: shippingAddress.address.zipcode,
        });
    });
    it('should not be able to get a shipping address from another customer', async () => {
        const shippingAddress = (0, make_shipping_address_1.makeShippingAddress)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
        }, new unique_entity_id_1.UniqueEntityID('shipping-address-1'));
        inMemoryShippingAddressRepository.items.push(shippingAddress);
        const result = await sut.execute({
            customerId: 'another-customer-id',
            shippingAddressId: shippingAddress.id.toString(),
        });
        expect(result.isLeft()).toBeTruthy();
    });
});
//# sourceMappingURL=get-shipping-address.test.js.map