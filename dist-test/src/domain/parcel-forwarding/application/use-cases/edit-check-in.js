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
exports.EditCheckInUseCase = void 0;
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const check_in_attachment_1 = require("../../enterprise/entities/check-in-attachment");
const either_1 = require("../../../../core/either");
const check_ins_repository_1 = require("../repositories/check-ins-repository");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const not_allowed_error_1 = require("../../../../core/errors/errors/not-allowed-error");
const check_in_attachments_repository_1 = require("../repositories/check-in-attachments-repository");
const check_in_attachment_list_1 = require("../../enterprise/entities/check-in-attachment-list");
const common_1 = require("@nestjs/common");
let EditCheckInUseCase = class EditCheckInUseCase {
    checkInsRepository;
    checkInAttachmentsRepository;
    constructor(checkInsRepository, checkInAttachmentsRepository) {
        this.checkInsRepository = checkInsRepository;
        this.checkInAttachmentsRepository = checkInAttachmentsRepository;
    }
    async execute({ checkInId, parcelForwardingId, customerId, status, details, weight, attachmentsIds, }) {
        const checkin = await this.checkInsRepository.findById(checkInId);
        if (!checkin) {
            return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError());
        }
        if (checkin.parcelForwardingId.toString() !== parcelForwardingId) {
            return (0, either_1.left)(new not_allowed_error_1.NotAllowedError('This check-in cannot be edited by you.'));
        }
        if (customerId !== checkin.customerId.toString()) {
            return (0, either_1.left)(new not_allowed_error_1.NotAllowedError('This check-in cannot be edited by you.'));
        }
        const currentCheckinAttachments = await this.checkInAttachmentsRepository.findManyByCheckInId(checkInId);
        const checkInAttachmentList = new check_in_attachment_list_1.CheckInAttachmentList(currentCheckinAttachments);
        const checkInAttachments = attachmentsIds.map((attachmentId) => {
            return check_in_attachment_1.CheckInAttachment.create({
                attachmentId: new unique_entity_id_1.UniqueEntityID(attachmentId),
                checkInId: checkin.id,
            });
        });
        checkInAttachmentList.update(checkInAttachments);
        checkin.attachments = checkInAttachmentList;
        details ? (checkin.details = details) : (details = null);
        checkin.status = status;
        weight ? (checkin.weight = weight) : (weight = null);
        await this.checkInsRepository.save(checkin);
        return (0, either_1.right)({
            checkin,
        });
    }
};
exports.EditCheckInUseCase = EditCheckInUseCase;
exports.EditCheckInUseCase = EditCheckInUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [check_ins_repository_1.CheckInsRepository,
        check_in_attachments_repository_1.CheckInAttachmentsRepository])
], EditCheckInUseCase);
//# sourceMappingURL=edit-check-in.js.map