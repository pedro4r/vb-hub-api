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
exports.PrismaCheckInsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_check_in_mapper_1 = require("../mappers/prisma-check-in-mapper");
const prisma_service_1 = require("../prisma.service");
const check_in_attachments_repository_1 = require("../../../../domain/parcel-forwarding/application/repositories/check-in-attachments-repository");
const check_in_details_1 = require("../../../../domain/parcel-forwarding/enterprise/entities/value-objects/check-in-details");
const prisma_attachment_mapper_1 = require("../mappers/prisma-attachment-mapper");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const check_in_preview_1 = require("../../../../domain/parcel-forwarding/enterprise/entities/value-objects/check-in-preview");
const domain_events_1 = require("../../../../core/events/domain-events");
let PrismaCheckInsRepository = class PrismaCheckInsRepository {
    prisma;
    checkInAttachmentsRepository;
    constructor(prisma, checkInAttachmentsRepository) {
        this.prisma = prisma;
        this.checkInAttachmentsRepository = checkInAttachmentsRepository;
    }
    async findManyWithDetailsByPackageId(packadeId, page) {
        const checkIns = await this.prisma.checkIn.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            where: {
                packageId: packadeId,
            },
            take: 20,
            skip: (page - 1) * 20,
        });
        const checkInDetails = await Promise.all(checkIns.map(async (checkIn) => {
            const customer = await this.prisma.customer.findUnique({
                where: {
                    id: checkIn.customerId.toString(),
                },
            });
            if (!customer) {
                throw new resource_not_found_error_1.ResourceNotFoundError(`Customer with ID "${checkIn.customerId.toString()}" does not exist.`);
            }
            const checkInAttachments = await this.prisma.checkInAttachment.findMany({
                where: {
                    checkInId: checkIn.id,
                },
            });
            const attachmentsId = checkInAttachments.map((checkInAttachment) => {
                return checkInAttachment.attachmentId.toString();
            });
            const attachments = await this.prisma.attachment.findMany({
                where: {
                    id: {
                        in: attachmentsId,
                    },
                },
            });
            if (attachments.length === 0) {
                throw new Error(`Attachments do not exist.`);
            }
            const attachmentsDomain = attachments.map(prisma_attachment_mapper_1.PrismaAttachmentMapper.toDomain);
            const checkInDomain = prisma_check_in_mapper_1.PrismaCheckInMapper.toDomain(checkIn);
            return check_in_details_1.CheckInDetails.create({
                checkInId: checkInDomain.id,
                parcelForwardingId: checkInDomain.parcelForwardingId,
                customerId: checkInDomain.customerId,
                hubId: customer.hubId,
                customerFirstName: customer.firstName,
                customerLastName: customer.lastName,
                packageId: checkInDomain.packageId,
                details: checkInDomain.details,
                status: checkInDomain.status,
                attachments: attachmentsDomain,
                weight: checkInDomain.weight,
                createdAt: checkInDomain.createdAt,
                updatedAt: checkInDomain.updatedAt,
            });
        }));
        return checkInDetails;
    }
    async findManyByPackageId(packadeId) {
        const checkIns = await this.prisma.checkIn.findMany({
            where: {
                packageId: packadeId,
            },
        });
        return checkIns.map(prisma_check_in_mapper_1.PrismaCheckInMapper.toDomain);
    }
    async linkManyCheckInToPackage(checkIns) {
        await Promise.all(checkIns.map((checkIn) => {
            return this.prisma.checkIn.update({
                where: {
                    id: checkIn.checkInId.toString(),
                },
                data: {
                    packageId: checkIn.packageId.toString(),
                },
            });
        }));
    }
    async unlinkManyCheckInToPackage(checkIns) {
        await Promise.all(checkIns.map((checkIn) => {
            return this.prisma.checkIn.update({
                where: {
                    id: checkIn.checkInId.toString(),
                },
                data: {
                    packageId: null,
                },
            });
        }));
    }
    async findManyRecentByParcelForwardingId(parcelForwardingId, page) {
        const checkIns = await this.prisma.checkIn.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            where: {
                parcelForwardingId,
            },
            take: 20,
            skip: (page - 1) * 20,
        });
        const checkInDetails = await Promise.all(checkIns.map(async (checkIn) => {
            const customer = await this.prisma.customer.findUnique({
                where: {
                    id: checkIn.customerId.toString(),
                },
            });
            if (!customer) {
                throw new resource_not_found_error_1.ResourceNotFoundError(`Customer with ID "${checkIn.customerId.toString()}" does not exist.`);
            }
            const checkInDomain = prisma_check_in_mapper_1.PrismaCheckInMapper.toDomain(checkIn);
            return check_in_preview_1.CheckInPreview.create({
                checkInId: checkInDomain.id,
                parcelForwardingId: checkInDomain.parcelForwardingId,
                customerId: checkInDomain.customerId,
                hubId: customer.hubId,
                customerFirstName: customer.firstName,
                customerLastName: customer.lastName,
                packageId: checkInDomain.packageId,
                status: checkInDomain.status,
                weight: checkInDomain.weight,
                createdAt: checkInDomain.createdAt,
                updatedAt: checkInDomain.updatedAt,
            });
        }));
        return checkInDetails;
    }
    async create(checkIn) {
        const data = prisma_check_in_mapper_1.PrismaCheckInMapper.toPrisma(checkIn);
        await this.prisma.checkIn.create({
            data,
        });
        await this.checkInAttachmentsRepository.createMany(checkIn.attachments.getItems());
    }
    async findById(id) {
        const checkIn = await this.prisma.checkIn.findUnique({
            where: {
                id,
            },
        });
        if (!checkIn) {
            return null;
        }
        return prisma_check_in_mapper_1.PrismaCheckInMapper.toDomain(checkIn);
    }
    async save(checkIn) {
        const data = prisma_check_in_mapper_1.PrismaCheckInMapper.toPrisma(checkIn);
        await this.prisma.checkIn.update({
            where: {
                id: data.id,
            },
            data,
        });
        await this.checkInAttachmentsRepository.createMany(checkIn.attachments.getNewItems());
        await this.checkInAttachmentsRepository.deleteMany(checkIn.attachments.getRemovedItems());
        domain_events_1.DomainEvents.dispatchEventsForAggregate(checkIn.id);
    }
    async delete(checkIn) {
        const data = prisma_check_in_mapper_1.PrismaCheckInMapper.toPrisma(checkIn);
        await this.checkInAttachmentsRepository.deleteManyByCheckInId(data.id);
        await this.prisma.checkIn.delete({
            where: {
                id: data.id,
            },
        });
    }
    async findDetailsById(checkInId) {
        const checkIn = await this.prisma.checkIn.findUnique({
            where: {
                id: checkInId,
            },
        });
        if (!checkIn) {
            return null;
        }
        const customer = await this.prisma.customer.findUnique({
            where: {
                id: checkIn.customerId,
            },
        });
        if (!customer) {
            throw new Error(`Customer with ID "${checkIn.customerId.toString()}" does not exist.`);
        }
        const checkInAttachments = await this.prisma.checkInAttachment.findMany({
            where: {
                checkInId: checkIn.id,
            },
        });
        const attachmentsId = checkInAttachments.map((checkInAttachment) => {
            return checkInAttachment.attachmentId.toString();
        });
        const attachments = await this.prisma.attachment.findMany({
            where: {
                id: {
                    in: attachmentsId,
                },
            },
        });
        if (attachments.length === 0) {
            throw new Error(`Attachments do not exist.`);
        }
        const attachmentsDomain = attachments.map(prisma_attachment_mapper_1.PrismaAttachmentMapper.toDomain);
        const checkInDomain = prisma_check_in_mapper_1.PrismaCheckInMapper.toDomain(checkIn);
        return check_in_details_1.CheckInDetails.create({
            checkInId: checkInDomain.id,
            parcelForwardingId: checkInDomain.parcelForwardingId,
            customerId: checkInDomain.customerId,
            hubId: customer.hubId,
            customerFirstName: customer.firstName,
            customerLastName: customer.lastName,
            packageId: checkInDomain.packageId,
            details: checkInDomain.details,
            status: checkInDomain.status,
            attachments: attachmentsDomain,
            weight: checkInDomain.weight,
            createdAt: checkInDomain.createdAt,
            updatedAt: checkInDomain.updatedAt,
        });
    }
    async findManyRecentCheckInsDetailsByParcelForwardingId(parcelForwardingId, page) {
        const checkIns = await this.prisma.checkIn.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            where: {
                parcelForwardingId,
            },
            take: 20,
            skip: (page - 1) * 20,
        });
        const checkInsDetails = await Promise.all(checkIns.map(async (checkIn) => {
            const customer = await this.prisma.customer.findUnique({
                where: {
                    id: checkIn.customerId.toString(),
                },
            });
            if (!customer) {
                throw new resource_not_found_error_1.ResourceNotFoundError(`Customer with ID "${checkIn.customerId.toString()}" does not exist.`);
            }
            const checkInAttachments = await this.prisma.checkInAttachment.findMany({
                where: {
                    checkInId: checkIn.id,
                },
            });
            const attachmentsId = checkInAttachments.map((checkInAttachment) => {
                return checkInAttachment.attachmentId.toString();
            });
            const attachments = await this.prisma.attachment.findMany({
                where: {
                    id: {
                        in: attachmentsId,
                    },
                },
            });
            if (attachments.length === 0) {
                throw new Error(`Attachments do not exist.`);
            }
            const attachmentsDomain = attachments.map(prisma_attachment_mapper_1.PrismaAttachmentMapper.toDomain);
            const checkInDomain = prisma_check_in_mapper_1.PrismaCheckInMapper.toDomain(checkIn);
            return check_in_details_1.CheckInDetails.create({
                checkInId: checkInDomain.id,
                parcelForwardingId: checkInDomain.parcelForwardingId,
                customerId: checkInDomain.customerId,
                hubId: customer.hubId,
                customerFirstName: customer.firstName,
                customerLastName: customer.lastName,
                packageId: checkInDomain.packageId,
                details: checkInDomain.details,
                status: checkInDomain.status,
                attachments: attachmentsDomain,
                weight: checkInDomain.weight,
                createdAt: checkInDomain.createdAt,
                updatedAt: checkInDomain.updatedAt,
            });
        }));
        return checkInsDetails;
    }
};
exports.PrismaCheckInsRepository = PrismaCheckInsRepository;
exports.PrismaCheckInsRepository = PrismaCheckInsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        check_in_attachments_repository_1.CheckInAttachmentsRepository])
], PrismaCheckInsRepository);
//# sourceMappingURL=prisma-check-ins-repository.js.map