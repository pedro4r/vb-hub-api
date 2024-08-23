"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaCheckInAttachmentsMapper = void 0;
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const check_in_attachment_1 = require("../../../../domain/parcel-forwarding/enterprise/entities/check-in-attachment");
class PrismaCheckInAttachmentsMapper {
    static toDomain(raw) {
        return check_in_attachment_1.CheckInAttachment.create({
            attachmentId: new unique_entity_id_1.UniqueEntityID(raw.attachmentId),
            checkInId: new unique_entity_id_1.UniqueEntityID(raw.checkInId),
        }, new unique_entity_id_1.UniqueEntityID(raw.id));
    }
    static toPrisma(attachment, index) {
        return {
            id: attachment.id.toString(),
            attachmentId: attachment.attachmentId.toString(),
            checkInId: attachment.checkInId.toString(),
            createdAt: new Date(Date.now() + (index ?? 1) * 1000),
        };
    }
}
exports.PrismaCheckInAttachmentsMapper = PrismaCheckInAttachmentsMapper;
//# sourceMappingURL=prisma-check-in-attachment-mapper.js.map