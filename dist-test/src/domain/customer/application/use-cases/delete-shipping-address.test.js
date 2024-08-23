"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_shipping_address_repository_1 = require("../../../../../test/repositories/in-memory-shipping-address-repository");
const delete_shipping_address_1 = require("./delete-shipping-address");
const make_shipping_address_1 = require("../../../../../test/factories/make-shipping-address");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
let inMemoryShippingAddressRepository;
let sut;
describe('Delete an Address', () => {
    beforeEach(() => {
        inMemoryShippingAddressRepository = new in_memory_shipping_address_repository_1.InMemoryShippingAddressRepository();
        sut = new delete_shipping_address_1.DeleteShippingAddressUseCase(inMemoryShippingAddressRepository);
    });
    it('should be able to delete a shipping address', async () => {
        const shippingAddress1 = (0, make_shipping_address_1.makeShippingAddress)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
        }, new unique_entity_id_1.UniqueEntityID('shipping-address-1'));
        const shippingAddress2 = (0, make_shipping_address_1.makeShippingAddress)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
        }, new unique_entity_id_1.UniqueEntityID('shippingAddress-2'));
        inMemoryShippingAddressRepository.items.push(shippingAddress1);
        inMemoryShippingAddressRepository.items.push(shippingAddress2);
        await sut.execute({
            shippingAddressId: shippingAddress1.id.toString(),
            customerId: shippingAddress1.customerId.toString(),
        });
        expect(inMemoryShippingAddressRepository.items.length === 1).toBeTruthy();
        expect(inMemoryShippingAddressRepository.items[0]).toEqual(shippingAddress2);
    });
    it('not should be able to delete a shipping address when there is only one last', async () => {
        const address = (0, make_shipping_address_1.makeShippingAddress)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
        }, new unique_entity_id_1.UniqueEntityID('shipping-address-1'));
        inMemoryShippingAddressRepository.items.push(address);
        const result = await sut.execute({
            shippingAddressId: address.id.toString(),
            customerId: address.customerId.toString(),
        });
        expect(result.isLeft).toBeTruthy();
        expect(inMemoryShippingAddressRepository.items.length === 1).toBeTruthy();
    });
    it('should not be able to delete a shipping address from another customer', async () => {
        const address = (0, make_shipping_address_1.makeShippingAddress)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
        }, new unique_entity_id_1.UniqueEntityID('shipping-address-1'));
        inMemoryShippingAddressRepository.items.push(address);
        const result = await sut.execute({
            shippingAddressId: address.id.toString(),
            customerId: 'customer-2',
        });
        expect(result.isLeft).toBeTruthy();
        expect(inMemoryShippingAddressRepository.items.length === 1).toBeTruthy();
    });
});
//# sourceMappingURL=delete-shipping-address.test.js.map