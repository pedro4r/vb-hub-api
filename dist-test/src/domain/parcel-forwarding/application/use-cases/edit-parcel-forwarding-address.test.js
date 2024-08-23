"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_parcel_forwarding_address_repository_1 = require("../../../../../test/repositories/in-memory-parcel-forwarding-address-repository");
const edit_parcel_forwarding_address_1 = require("./edit-parcel-forwarding-address");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const make_forwarding_address_1 = require("../../../../../test/factories/make-forwarding-address");
let inMemoryParcelForwardingAddressesRepository;
let sut;
describe('Edit Forwarding Address', () => {
    beforeEach(() => {
        inMemoryParcelForwardingAddressesRepository =
            new in_memory_parcel_forwarding_address_repository_1.InMemoryParcelForwardingAddressesRepository();
        sut = new edit_parcel_forwarding_address_1.EditParcelForwardingAddressUseCase(inMemoryParcelForwardingAddressesRepository);
    });
    it('should be able to edit a forwarding address', async () => {
        const newParcelForwardingAddress = (0, make_forwarding_address_1.makeParcelForwardingAddress)({
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcel-forwarding-1'),
        }, new unique_entity_id_1.UniqueEntityID('forwarding-address-1'));
        await inMemoryParcelForwardingAddressesRepository.create(newParcelForwardingAddress);
        await sut.execute({
            parcelForwardingAddressId: newParcelForwardingAddress.id.toString(),
            parcelForwardingId: newParcelForwardingAddress.parcelForwardingId.toString(),
            address: 'New address',
            complement: 'New complement',
            city: 'New city',
            state: 'New state',
            zipcode: 'New zipcode',
            country: 'New country',
        });
        expect(inMemoryParcelForwardingAddressesRepository.items[0].address).toMatchObject({
            zipcode: 'New zipcode',
        });
    });
    it('should not be able to edit a forwarding address from another parcel forwarding', async () => {
        const newParcelForwardingAddress = (0, make_forwarding_address_1.makeParcelForwardingAddress)({
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcel-forwarding-1'),
        }, new unique_entity_id_1.UniqueEntityID('forwarding-address-1'));
        await inMemoryParcelForwardingAddressesRepository.create(newParcelForwardingAddress);
        const result = await sut.execute({
            parcelForwardingAddressId: newParcelForwardingAddress.id.toString(),
            parcelForwardingId: 'another-customer-id',
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
//# sourceMappingURL=edit-parcel-forwarding-address.test.js.map