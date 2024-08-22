"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fake_hasher_1 = require("../../../../../test/cryptography/fake-hasher");
const in_memory_customer_repository_1 = require("../../../../../test/repositories/in-memory-customer-repository");
const register_customer_1 = require("./register-customer");
const in_memory_parcel_forwarding_repository_1 = require("../../../../../test/repositories/in-memory-parcel-forwarding-repository");
const make_parcel_forwarding_1 = require("../../../../../test/factories/make-parcel-forwarding");
let inMemoryParcelForwardingsRepository;
let inMemoryCustomerRepository;
let fakeHasher;
let sut;
describe('Register Customer', () => {
    beforeEach(() => {
        inMemoryParcelForwardingsRepository =
            new in_memory_parcel_forwarding_repository_1.InMemoryParcelForwardingsRepository();
        inMemoryCustomerRepository = new in_memory_customer_repository_1.InMemoryCustomerRepository();
        fakeHasher = new fake_hasher_1.FakeHasher();
        sut = new register_customer_1.RegisterCustomerUseCase(inMemoryCustomerRepository, inMemoryParcelForwardingsRepository, fakeHasher);
    });
    it('should be able to register a new customer', async () => {
        const parcelforwarding = (0, make_parcel_forwarding_1.makeParcelForwarding)({
            email: 'johndoe@example.com',
            password: await fakeHasher.hash('123456'),
        });
        inMemoryParcelForwardingsRepository.items.push(parcelforwarding);
        const result = await sut.execute({
            parcelForwardingId: parcelforwarding.id.toString(),
            firstName: 'Pedro',
            lastName: 'Requiao',
            email: 'pedro@example.com',
            password: '123456',
        });
        expect(result.isRight()).toBe(true);
        expect(result.value).toEqual({
            customer: inMemoryCustomerRepository.items[0],
        });
    });
    it('should hash customer password upon registration', async () => {
        const parcelforwarding = (0, make_parcel_forwarding_1.makeParcelForwarding)({
            email: 'johndoe@example.com',
            password: await fakeHasher.hash('123456'),
        });
        inMemoryParcelForwardingsRepository.items.push(parcelforwarding);
        const result = await sut.execute({
            parcelForwardingId: parcelforwarding.id.toString(),
            firstName: 'Pedro',
            lastName: 'Requiao',
            email: 'pedro@example.com',
            password: '123456',
        });
        const hashedPassword = await fakeHasher.hash('123456');
        expect(result.isRight()).toBe(true);
        expect(inMemoryCustomerRepository.items[0].password).toEqual(hashedPassword);
    });
});
//# sourceMappingURL=register-customer.test.js.map