"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const get_hub_address_1 = require("./get-hub-address");
const in_memory_parcel_forwarding_address_repository_1 = require("../../../../../test/repositories/in-memory-parcel-forwarding-address-repository");
const in_memory_customer_repository_1 = require("../../../../../test/repositories/in-memory-customer-repository");
const make_forwarding_address_1 = require("../../../../../test/factories/make-forwarding-address");
const make_customer_1 = require("../../../../../test/factories/make-customer");
const in_memory_shipping_address_repository_1 = require("../../../../../test/repositories/in-memory-shipping-address-repository");
const make_shipping_address_1 = require("../../../../../test/factories/make-shipping-address");
let inMemoryCustomerRepository;
let inMemoryParcelForwardingAddressesRepository;
let inMemoryShippingAddressRepository;
let sut;
describe('Get Hub Address', () => {
    beforeEach(() => {
        inMemoryCustomerRepository = new in_memory_customer_repository_1.InMemoryCustomerRepository();
        inMemoryParcelForwardingAddressesRepository =
            new in_memory_parcel_forwarding_address_repository_1.InMemoryParcelForwardingAddressesRepository();
        inMemoryShippingAddressRepository = new in_memory_shipping_address_repository_1.InMemoryShippingAddressRepository();
        sut = new get_hub_address_1.GetHubAddressUseCase(inMemoryCustomerRepository, inMemoryParcelForwardingAddressesRepository, inMemoryShippingAddressRepository);
    });
    it('should be able to get a hub address', async () => {
        const shippingAddress = (0, make_shipping_address_1.makeShippingAddress)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
        });
        await inMemoryShippingAddressRepository.create(shippingAddress);
        const parcelForwardingAddress = (0, make_forwarding_address_1.makeParcelForwardingAddress)({
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcel-forwarding-1'),
        }, new unique_entity_id_1.UniqueEntityID('forwarding-address-1'));
        inMemoryParcelForwardingAddressesRepository.items.push(parcelForwardingAddress);
        const customer = (0, make_customer_1.makeCustomer)({
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcel-forwarding-1'),
        }, new unique_entity_id_1.UniqueEntityID('customer-1'));
        inMemoryCustomerRepository.items.push(customer);
        const result = await sut.execute({
            customerId: customer.id.toString(),
        });
        expect(result.isRight()).toBeTruthy();
        expect(result.value).toEqual(expect.objectContaining({
            hubAddress: expect.objectContaining({
                customerHubId: expect.any(Number),
                parcelForwardingAddress: expect.objectContaining({
                    id: parcelForwardingAddress.id,
                }),
            }),
        }));
    });
    it('should not be able to get a hub address from another customer', async () => {
        const parcelForwardingAddress = (0, make_forwarding_address_1.makeParcelForwardingAddress)({
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcel-forwarding-1'),
        }, new unique_entity_id_1.UniqueEntityID('forwarding-address-1'));
        inMemoryParcelForwardingAddressesRepository.items.push(parcelForwardingAddress);
        const customer = (0, make_customer_1.makeCustomer)({
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcel-forwarding-1'),
        }, new unique_entity_id_1.UniqueEntityID('customer-1'));
        inMemoryCustomerRepository.items.push(customer);
        const result = await sut.execute({
            customerId: 'customer-2',
        });
        expect(result.isLeft()).toBeTruthy();
    });
    it('should not be able to get a hub address without a shipping address created', async () => {
        const parcelForwardingAddress = (0, make_forwarding_address_1.makeParcelForwardingAddress)({
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcel-forwarding-1'),
        }, new unique_entity_id_1.UniqueEntityID('forwarding-address-1'));
        inMemoryParcelForwardingAddressesRepository.items.push(parcelForwardingAddress);
        const customer = (0, make_customer_1.makeCustomer)({
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID('parcel-forwarding-1'),
        }, new unique_entity_id_1.UniqueEntityID('customer-1'));
        inMemoryCustomerRepository.items.push(customer);
        const result = await sut.execute({
            customerId: 'customer-2',
        });
        expect(result.isLeft()).toBeTruthy();
    });
});
//# sourceMappingURL=get-hub-address.test.js.map