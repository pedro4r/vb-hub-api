"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaAttachmentMapper = void 0;
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const attachment_1 = require("../../../../domain/parcel-forwarding/enterprise/entities/attachment");
class PrismaAttachmentMapper {
    static toDomain(raw) {
        return attachment_1.Attachment.create({
            url: raw.url,
        }, new unique_entity_id_1.UniqueEntityID(raw.id));
    }
    static toPrisma(attachment) {
        return {
            id: attachment.id.toString(),
            url: attachment.url,
        };
    }
}
exports.PrismaAttachmentMapper = PrismaAttachmentMapper;
//# sourceMappingURL=prisma-attachment-mapper.js.map