"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryCheckInsRepository = void 0;
const domain_events_1 = require("../../src/core/events/domain-events");
const check_in_details_1 = require("../../src/domain/parcel-forwarding/enterprise/entities/value-objects/check-in-details");
const check_in_preview_1 = require("../../src/domain/parcel-forwarding/enterprise/entities/value-objects/check-in-preview");
class InMemoryCheckInsRepository {
    checkInsAttachmentsRepository;
    attachmentsRepository;
    customerRepository;
    items = [];
    constructor(checkInsAttachmentsRepository, attachmentsRepository, customerRepository) {
        this.checkInsAttachmentsRepository = checkInsAttachmentsRepository;
        this.attachmentsRepository = attachmentsRepository;
        this.customerRepository = customerRepository;
    }
    async findManyByPackageId(packadeId) {
        const checkIns = this.items.filter((item) => item.packageId?.toString() === packadeId);
        return checkIns;
    }
    async findManyWithDetailsByPackageId(packageId, page) {
        const checkIns = this.items
            .filter((item) => item.packageId?.toString() === packageId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice((page - 1) * 20, page * 20);
        const checkInsDetails = await Promise.all(checkIns.map(async (checkIn) => {
            const customer = await this.customerRepository.findById(checkIn.customerId.toString());
            if (!customer) {
                throw new Error(`Customer with ID "${checkIn.customerId.toString()}" does not exist.`);
            }
            const checkInAttachments = await this.checkInsAttachmentsRepository.findManyByCheckInId(checkIn.id.toString());
            const attachmentsId = checkInAttachments.map((checkInAttachment) => {
                return checkInAttachment.attachmentId.toString();
            });
            const attachments = await this.attachmentsRepository.findManyByIds(attachmentsId);
            if (attachments.length === 0) {
                throw new Error(`Attachments do not exist.`);
            }
            return check_in_details_1.CheckInDetails.create({
                checkInId: checkIn.id,
                parcelForwardingId: checkIn.parcelForwardingId,
                customerId: checkIn.customerId,
                hubId: customer.hubId,
                customerFirstName: customer.firstName,
                customerLastName: customer.lastName,
                packageId: checkIn.packageId,
                details: checkIn.details,
                status: checkIn.status,
                attachments,
                weight: checkIn.weight,
                createdAt: checkIn.createdAt,
                updatedAt: checkIn.updatedAt,
            });
        }));
        return checkInsDetails;
    }
    async linkManyCheckInToPackage(checkIns) {
        checkIns.forEach((checkIn) => {
            const item = this.items.find((item) => item.id.toString() === checkIn.checkInId.toString());
            if (item) {
                item.packageId = checkIn.packageId;
            }
        });
    }
    async unlinkManyCheckInToPackage(checkIns) {
        checkIns.forEach((checkIn) => {
            const item = this.items.find((item) => item.id.toString() === checkIn.checkInId.toString());
            if (item) {
                item.packageId = null;
            }
        });
    }
    async findManyRecentByParcelForwardingId(parcelForwardingId, page) {
        const checkIns = this.items
            .filter((item) => item.parcelForwardingId.toString() === parcelForwardingId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice((page - 1) * 20, page * 20);
        const checkInDetails = await Promise.all(checkIns.map(async (checkIn) => {
            const customer = await this.customerRepository.findById(checkIn.customerId.toString());
            if (!customer) {
                throw new Error(`Customer with ID "${checkIn.customerId.toString()}" does not exist.`);
            }
            return check_in_preview_1.CheckInPreview.create({
                checkInId: checkIn.id,
                parcelForwardingId: checkIn.parcelForwardingId,
                customerId: checkIn.customerId,
                hubId: customer.hubId,
                customerFirstName: customer.firstName,
                customerLastName: customer.lastName,
                packageId: checkIn.packageId,
                status: checkIn.status,
                weight: checkIn.weight,
                createdAt: checkIn.createdAt,
                updatedAt: checkIn.updatedAt,
            });
        }));
        return checkInDetails;
    }
    async delete(checkin) {
        const itemIndex = this.items.findIndex((item) => item.id === checkin.id);
        this.items.splice(itemIndex, 1);
        this.checkInsAttachmentsRepository.deleteManyByCheckInId(checkin.id.toString());
    }
    async findById(id) {
        const checkin = this.items.find((item) => item.id.toString() === id);
        if (!checkin) {
            return null;
        }
        return checkin;
    }
    async save(checkin) {
        const itemIndex = this.items.findIndex((item) => item.id === checkin.id);
        this.items[itemIndex] = checkin;
        await this.checkInsAttachmentsRepository.createMany(checkin.attachments.getNewItems());
        await this.checkInsAttachmentsRepository.deleteMany(checkin.attachments.getRemovedItems());
        domain_events_1.DomainEvents.dispatchEventsForAggregate(checkin.id);
    }
    async create(checkin) {
        this.items.push(checkin);
        await this.checkInsAttachmentsRepository.createMany(checkin.attachments.getItems());
        domain_events_1.DomainEvents.dispatchEventsForAggregate(checkin.id);
    }
    async findDetailsById(checkInId) {
        const checkIn = this.items.find((item) => item.id.toString() === checkInId);
        if (!checkIn) {
            return null;
        }
        const customer = await this.customerRepository.findById(checkIn.customerId.toString());
        if (!customer) {
            throw new Error(`Customer with ID "${checkIn.customerId.toString()}" does not exist.`);
        }
        const checkInAttachments = await this.checkInsAttachmentsRepository.findManyByCheckInId(checkIn.id.toString());
        const attachmentsId = checkInAttachments.map((checkInAttachment) => {
            return checkInAttachment.attachmentId.toString();
        });
        const attachments = await this.attachmentsRepository.findManyByIds(attachmentsId);
        if (attachments.length === 0) {
            throw new Error(`Attachments do not exist.`);
        }
        return check_in_details_1.CheckInDetails.create({
            checkInId: checkIn.id,
            parcelForwardingId: checkIn.parcelForwardingId,
            customerId: checkIn.customerId,
            hubId: customer.hubId,
            customerFirstName: customer.firstName,
            customerLastName: customer.lastName,
            packageId: checkIn.packageId,
            details: checkIn.details,
            status: checkIn.status,
            attachments,
            weight: checkIn.weight,
            createdAt: checkIn.createdAt,
            updatedAt: checkIn.updatedAt,
        });
    }
    async findManyRecentCheckInsDetailsByParcelForwardingId(parcelForwardingId, page) {
        const checkIns = this.items
            .filter((item) => item.parcelForwardingId.toString() === parcelForwardingId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice((page - 1) * 20, page * 20);
        const checkInsDetails = await Promise.all(checkIns.map(async (checkIn) => {
            const customer = await this.customerRepository.findById(checkIn.customerId.toString());
            if (!customer) {
                throw new Error(`Customer with ID "${checkIn.customerId.toString()}" does not exist.`);
            }
            const checkInAttachments = await this.checkInsAttachmentsRepository.findManyByCheckInId(checkIn.id.toString());
            const attachmentsId = checkInAttachments.map((checkInAttachment) => {
                return checkInAttachment.attachmentId.toString();
            });
            const attachments = await this.attachmentsRepository.findManyByIds(attachmentsId);
            if (attachments.length === 0) {
                throw new Error(`Attachments do not exist.`);
            }
            return check_in_details_1.CheckInDetails.create({
                checkInId: checkIn.id,
                parcelForwardingId: checkIn.parcelForwardingId,
                customerId: checkIn.customerId,
                hubId: customer.hubId,
                customerFirstName: customer.firstName,
                customerLastName: customer.lastName,
                packageId: checkIn.packageId,
                details: checkIn.details,
                status: checkIn.status,
                attachments,
                weight: checkIn.weight,
                createdAt: checkIn.createdAt,
                updatedAt: checkIn.updatedAt,
            });
        }));
        return checkInsDetails;
    }
}
exports.InMemoryCheckInsRepository = InMemoryCheckInsRepository;
//# sourceMappingURL=in-memory-check-ins-repository.js.map