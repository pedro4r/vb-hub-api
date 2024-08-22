"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryAttachmentsRepository = void 0;
class InMemoryAttachmentsRepository {
    items = [];
    async create(attachment) {
        this.items.push(attachment);
    }
    async findManyByIds(ids) {
        return this.items.filter((item) => ids.includes(item.id.toString()));
    }
}
exports.InMemoryAttachmentsRepository = InMemoryAttachmentsRepository;
//# sourceMappingURL=in-memory-attachments-repository.js.map