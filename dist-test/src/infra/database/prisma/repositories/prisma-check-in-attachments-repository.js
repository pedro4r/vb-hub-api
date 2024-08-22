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
exports.PrismaCheckInAttachmentsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const prisma_check_in_attachment_mapper_1 = require("../mappers/prisma-check-in-attachment-mapper");
let PrismaCheckInAttachmentsRepository = class PrismaCheckInAttachmentsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createMany(attachments) {
        await Promise.all(attachments.map((item, index) => {
            const itemData = prisma_check_in_attachment_mapper_1.PrismaCheckInAttachmentsMapper.toPrisma(item, index);
            return this.prisma.checkInAttachment.create({
                data: itemData,
            });
        }));
    }
    async deleteMany(checkInAttachments) {
        const attachmentIds = checkInAttachments.map((attachment) => {
            return attachment.attachmentId.toString();
        });
        await this.prisma.checkInAttachment.deleteMany({
            where: {
                attachmentId: {
                    in: attachmentIds,
                },
            },
        });
        await this.prisma.attachment.deleteMany({
            where: {
                id: {
                    in: attachmentIds,
                },
            },
        });
    }
    async deleteManyByCheckInId(checkInId) {
        const checkInAttachments = await this.prisma.checkInAttachment.findMany({
            where: {
                checkInId,
            },
        });
        const attachmentIds = checkInAttachments.map((attachment) => {
            return attachment.attachmentId;
        });
        await this.prisma.checkInAttachment.deleteMany({
            where: {
                checkInId,
            },
        });
        await this.prisma.attachment.deleteMany({
            where: {
                id: {
                    in: attachmentIds,
                },
            },
        });
    }
    async findManyByCheckInId(checkInId) {
        const checkInAttachments = await this.prisma.checkInAttachment.findMany({
            where: {
                checkInId,
            },
        });
        return checkInAttachments.map(prisma_check_in_attachment_mapper_1.PrismaCheckInAttachmentsMapper.toDomain);
    }
};
exports.PrismaCheckInAttachmentsRepository = PrismaCheckInAttachmentsRepository;
exports.PrismaCheckInAttachmentsRepository = PrismaCheckInAttachmentsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaCheckInAttachmentsRepository);
//# sourceMappingURL=prisma-check-in-attachments-repository.js.map