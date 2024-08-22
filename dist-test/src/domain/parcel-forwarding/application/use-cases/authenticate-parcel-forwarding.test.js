"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fake_encrypter_1 = require("../../../../../test/cryptography/fake-encrypter");
const authenticate_parcel_forwarding_1 = require("./authenticate-parcel-forwarding");
const fake_hasher_1 = require("../../../../../test/cryptography/fake-hasher");
const in_memory_parcel_forwarding_repository_1 = require("../../../../../test/repositories/in-memory-parcel-forwarding-repository");
const make_parcel_forwarding_1 = require("../../../../../test/factories/make-parcel-forwarding");
let inMemoryParcelForwardingsRepository;
let fakeHasher;
let encrypter;
let sut;
describe('Authenticate Parcel Forwarding', () => {
    beforeEach(() => {
        inMemoryParcelForwardingsRepository =
            new in_memory_parcel_forwarding_repository_1.InMemoryParcelForwardingsRepository();
        fakeHasher = new fake_hasher_1.FakeHasher();
        encrypter = new fake_encrypter_1.FakeEncrypter();
        sut = new authenticate_parcel_forwarding_1.AuthenticateUseCase(inMemoryParcelForwardingsRepository, fakeHasher, encrypter);
    });
    it('should be able to authenticate a parcelforwarding', async () => {
        const parcelforwarding = (0, make_parcel_forwarding_1.makeParcelForwarding)({
            email: 'johndoe@example.com',
            password: await fakeHasher.hash('123456'),
        });
        inMemoryParcelForwardingsRepository.items.push(parcelforwarding);
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
//# sourceMappingURL=authenticate-parcel-forwarding.test.js.map