"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeHasher = void 0;
class FakeHasher {
    async hash(plain) {
        return plain.concat('-hashed');
    }
    async compare(plain, hash) {
        return plain.concat('-hashed') === hash;
    }
}
exports.FakeHasher = FakeHasher;
//# sourceMappingURL=fake-hasher.js.map