"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_shipping_address_repository_1 = require("../../../../../test/repositories/in-memory-shipping-address-repository");
const create_shipping_address_1 = require("./create-shipping-address");
let inMemoryShippingAddressRepository;
let sut;
describe('Create Address', () => {
    beforeEach(() => {
        inMemoryShippingAddressRepository = new in_memory_shipping_address_repository_1.InMemoryShippingAddressRepository();
        sut = new create_shipping_address_1.CreateShippingAddressUseCase(inMemoryShippingAddressRepository);
    });
    it('should be able to create a shipping address', async () => {
        const result = await sut.execute({
            customerId: '1',
            recipientName: 'John Doe',
            phoneNumber: '123456789',
            email: 'johndoe@example.com',
            taxId: '123456789',
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipcode: '10001',
            country: 'USA',
        });
        expect(result.isRight()).toBe(true);
        expect(inMemoryShippingAddressRepository.items[0]).toEqual(result.value?.shippingAddress);
    });
});
//# sourceMappingURL=create-shipping-address.test.js.map