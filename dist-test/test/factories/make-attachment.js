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
exports.AttachmentFactory = void 0;
exports.makeAttachment = makeAttachment;
const attachment_1 = require("../../src/domain/parcel-forwarding/enterprise/entities/attachment");
const prisma_attachment_mapper_1 = require("../../src/infra/database/prisma/mappers/prisma-attachment-mapper");
const prisma_service_1 = require("../../src/infra/database/prisma/prisma.service");
const faker_1 = require("@faker-js/faker");
const common_1 = require("@nestjs/common");
function makeAttachment(override = {}, id) {
    const attachment = attachment_1.Attachment.create({
        url: faker_1.faker.lorem.slug(),
        ...override,
    }, id);
    return attachment;
}
let AttachmentFactory = class AttachmentFactory {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async makePrismaAttachment(data = {}) {
        const attachment = makeAttachment(data);
        await this.prisma.attachment.create({
            data: prisma_attachment_mapper_1.PrismaAttachmentMapper.toPrisma(attachment),
        });
        return attachment;
    }
};
exports.AttachmentFactory = AttachmentFactory;
exports.AttachmentFactory = AttachmentFactory = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttachmentFactory);
//# sourceMappingURL=make-attachment.js.map