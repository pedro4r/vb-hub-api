"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryCheckInsAttachmentsRepository = void 0;
class InMemoryCheckInsAttachmentsRepository {
    items = [];
    async findManyByCheckInId(checkInId) {
        const checkInAttachments = this.items.filter((item) => item.checkInId.toString() === checkInId);
        return checkInAttachments;
    }
    async createMany(attachments) {
        this.items.push(...attachments);
    }
    async deleteMany(attachments) {
        const checkInAttachments = this.items.filter((item) => {
            return !attachments.some((attachment) => attachment.equals(item));
        });
        this.items = checkInAttachments;
    }
    async deleteManyByCheckInId(checkInId) {
        const checkInAttachments = this.items.filter((item) => item.checkInId.toString() !== checkInId);
        this.items = checkInAttachments;
    }
}
exports.InMemoryCheckInsAttachmentsRepository = InMemoryCheckInsAttachmentsRepository;
//# sourceMappingURL=in-memory-check-ins-attachments-repository.js.map