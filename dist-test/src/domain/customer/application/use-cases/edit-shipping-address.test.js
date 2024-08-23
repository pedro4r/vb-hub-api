"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_shipping_address_repository_1 = require("../../../../../test/repositories/in-memory-shipping-address-repository");
const edit_shipping_address_1 = require("./edit-shipping-address");
const make_shipping_address_1 = require("../../../../../test/factories/make-shipping-address");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
let inMemoryShippingAddressRepository;
let sut;
describe('Edit Shipping Address', () => {
    beforeEach(() => {
        inMemoryShippingAddressRepository = new in_memory_shipping_address_repository_1.InMemoryShippingAddressRepository();
        sut = new edit_shipping_address_1.EditShippingAddressUseCase(inMemoryShippingAddressRepository);
    });
    it('should be able to edit a shipping address', async () => {
        const newShippingAddress = (0, make_shipping_address_1.makeShippingAddress)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
        }, new unique_entity_id_1.UniqueEntityID('shipping-address-1'));
        await inMemoryShippingAddressRepository.create(newShippingAddress);
        await sut.execute({
            shippingAddressId: newShippingAddress.id.toString(),
            customerId: newShippingAddress.customerId.toString(),
            recipientName: 'New recipient name',
            phoneNumber: 'New phoneNumber',
            email: 'johndoe@example.com',
            taxId: '123456789',
            address: 'New address',
            complement: 'New complement',
            city: 'New city',
            state: 'New state',
            zipcode: 'New zipcode',
            country: 'New country',
        });
        expect(inMemoryShippingAddressRepository.items[0].address).toMatchObject({
            zipcode: 'New zipcode',
        });
    });
    it('should not be able to edit a shipping address from another customer', async () => {
        const newShippingAddress = (0, make_shipping_address_1.makeShippingAddress)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
        }, new unique_entity_id_1.UniqueEntityID('shipping-address-1'));
        await inMemoryShippingAddressRepository.create(newShippingAddress);
        const result = await sut.execute({
            shippingAddressId: newShippingAddress.id.toString(),
            customerId: 'another-customer-id',
            recipientName: 'New recipient name',
            phoneNumber: 'New phoneNumber',
            email: 'johndoe@example.com',
            taxId: '123456789',
            address: 'New address',
            complement: 'New complement',
            city: 'New city',
            state: 'New state',
            zipcode: 'New zipcode',
            country: 'New country',
        });
        expect(result.isLeft).toBeTruthy();
    });
});
//# sourceMappingURL=edit-shipping-address.test.js.map