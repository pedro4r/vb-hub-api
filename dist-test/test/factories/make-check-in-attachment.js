"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInAttachmentFactory = void 0;
exports.makeCheckInAttachment = makeCheckInAttachment;
const unique_entity_id_1 = require("../../src/core/entities/unique-entity-id");
const check_in_attachment_1 = require("../../src/domain/parcel-forwarding/enterprise/entities/check-in-attachment");
const prisma_check_in_attachment_mapper_1 = require("../../src/infra/database/prisma/mappers/prisma-check-in-attachment-mapper");
const prisma_service_1 = require("../../src/infra/database/prisma/prisma.service");
const common_1 = require("@nestjs/common");
function makeCheckInAttachment(override = {}, id) {
    const checkInAttachment = check_in_attachment_1.CheckInAttachment.create({
        checkInId: new unique_entity_id_1.UniqueEntityID(),
        attachmentId: new unique_entity_id_1.UniqueEntityID(),
        ...override,
    }, id);
    return checkInAttachment;
}
let CheckInAttachmentFactory = class CheckInAttachmentFactory {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async makePrismaCheckInAttachment(data = {}) {
        const checkInAttachment = makeCheckInAttachment(data);
        await this.prisma.checkInAttachment.create({
            data: prisma_check_in_attachment_mapper_1.PrismaCheckInAttachmentsMapper.toPrisma(checkInAttachment),
        });
        return checkInAttachment;
    }
};
exports.CheckInAttachmentFactory = CheckInAttachmentFactory;
exports.CheckInAttachmentFactory = CheckInAttachmentFactory = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CheckInAttachmentFactory);
//# sourceMappingURL=make-check-in-attachment.js.map