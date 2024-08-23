"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_parcel_forwarding_address_repository_1 = require("../../../../../test/repositories/in-memory-parcel-forwarding-address-repository");
const create_parcel_forwarding_address_1 = require("./create-parcel-forwarding-address");
let inMemoryParcelForwardingAddressesRepository;
let sut;
describe('Create Forwarding Address', () => {
    beforeEach(() => {
        inMemoryParcelForwardingAddressesRepository =
            new in_memory_parcel_forwarding_address_repository_1.InMemoryParcelForwardingAddressesRepository();
        sut = new create_parcel_forwarding_address_1.CreateParcelForwardingAddressUseCase(inMemoryParcelForwardingAddressesRepository);
    });
    it('should be able to create a forwarding address', async () => {
        const result = await sut.execute({
            parcelForwardingId: '1',
            address: '1234 Main St',
            complement: 'Apt 123',
            city: 'Springfield',
            state: 'IL',
            zipcode: '62701',
            country: 'USA',
        });
        expect(result.isRight()).toBe(true);
        expect(inMemoryParcelForwardingAddressesRepository.items[0]).toEqual(result.value?.parcelForwardingAddress);
    });
});
//# sourceMappingURL=create-parcel-forwarding-address.test.js.map