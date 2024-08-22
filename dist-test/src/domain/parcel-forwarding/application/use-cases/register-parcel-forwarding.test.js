"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fake_hasher_1 = require("../../../../../test/cryptography/fake-hasher");
const in_memory_parcel_forwarding_repository_1 = require("../../../../../test/repositories/in-memory-parcel-forwarding-repository");
const register_parcel_forwarding_1 = require("./register-parcel-forwarding");
let inMemoryParcelForwardingsRepository;
let fakeHasher;
let sut;
describe('Register Parcel Forwarding', () => {
    beforeEach(() => {
        inMemoryParcelForwardingsRepository =
            new in_memory_parcel_forwarding_repository_1.InMemoryParcelForwardingsRepository();
        fakeHasher = new fake_hasher_1.FakeHasher();
        sut = new register_parcel_forwarding_1.RegisterParcelForwardingUseCase(inMemoryParcelForwardingsRepository, fakeHasher);
    });
    it('should be able to register a new parcel forwarding', async () => {
        const result = await sut.execute({
            name: 'Voabox',
            initials: 'VX',
            email: 'voabox@example.com',
            password: '123456',
        });
        expect(result.isRight()).toBe(true);
        expect(result.value).toEqual({
            parcelforwarding: inMemoryParcelForwardingsRepository.items[0],
        });
    });
    it('should hash parcel forwarding password upon registration', async () => {
        const result = await sut.execute({
            name: 'Voabox',
            initials: 'VX',
            email: 'voabox@example.com',
            password: '123456',
        });
        const hashedPassword = await fakeHasher.hash('123456');
        expect(result.isRight()).toBe(true);
        expect(inMemoryParcelForwardingsRepository.items[0].password).toEqual(hashedPassword);
    });
});
//# sourceMappingURL=register-parcel-forwarding.test.js.map