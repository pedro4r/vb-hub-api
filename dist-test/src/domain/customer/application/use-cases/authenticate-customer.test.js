"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fake_hasher_1 = require("../../../../../test/cryptography/fake-hasher");
const authenticate_customer_1 = require("./authenticate-customer");
const fake_encrypter_1 = require("../../../../../test/cryptography/fake-encrypter");
const make_customer_1 = require("../../../../../test/factories/make-customer");
const in_memory_customer_repository_1 = require("../../../../../test/repositories/in-memory-customer-repository");
let inMemoryCustomerRepository;
let fakeHasher;
let encrypter;
let sut;
describe('Authenticate Parcel Forwarding', () => {
    beforeEach(() => {
        inMemoryCustomerRepository = new in_memory_customer_repository_1.InMemoryCustomerRepository();
        fakeHasher = new fake_hasher_1.FakeHasher();
        encrypter = new fake_encrypter_1.FakeEncrypter();
        sut = new authenticate_customer_1.AuthenticateCustomerUseCase(inMemoryCustomerRepository, fakeHasher, encrypter);
    });
    it('should be able to authenticate a customer', async () => {
        const customer = (0, make_customer_1.makeCustomer)({
            email: 'johndoe@example.com',
            password: await fakeHasher.hash('123456'),
        });
        inMemoryCustomerRepository.items.push(customer);
        const result = await sut.execute({
            email: 'johndoe@example.com',
            password: '123456',
        });
        expect(result.isRight()).toBe(true);
        expect(result.value).toEqual({
            accessToken: expect.any(String),
        });
    });
});
//# sourceMappingURL=authenticate-customer.test.js.map