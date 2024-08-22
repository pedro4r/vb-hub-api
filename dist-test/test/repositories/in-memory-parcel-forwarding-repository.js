"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryParcelForwardingsRepository = void 0;
class InMemoryParcelForwardingsRepository {
    items = [];
    async findById(id) {
        const student = this.items.find((item) => item.id.toString() === id);
        if (!student) {
            return null;
        }
        return student;
    }
    async findByEmail(email) {
        const student = this.items.find((item) => item.email === email);
        if (!student) {
            return null;
        }
        return student;
    }
    async create(parcelForwarding) {
        this.items.push(parcelForwarding);
    }
}
exports.InMemoryParcelForwardingsRepository = InMemoryParcelForwardingsRepository;
//# sourceMappingURL=in-memory-parcel-forwarding-repository.js.map