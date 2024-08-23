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
exports.CheckInUseCase = void 0;
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const check_in_1 = require("../../enterprise/entities/check-in");
const check_in_attachment_1 = require("../../enterprise/entities/check-in-attachment");
const check_in_attachment_list_1 = require("../../enterprise/entities/check-in-attachment-list");
const either_1 = require("../../../../core/either");
const check_ins_repository_1 = require("../repositories/check-ins-repository");
const common_1 = require("@nestjs/common");
let CheckInUseCase = class CheckInUseCase {
    checkInsRepository;
    constructor(checkInsRepository) {
        this.checkInsRepository = checkInsRepository;
    }
    async execute({ parcelForwardingId, customerId, details, weight, status, attachmentsIds, }) {
        const checkin = check_in_1.CheckIn.create({
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID(parcelForwardingId),
            customerId: new unique_entity_id_1.UniqueEntityID(customerId),
            status,
            details,
            weight,
        });
        const checkInAttachments = attachmentsIds.map((attachmentId) => {
            return check_in_attachment_1.CheckInAttachment.create({
                checkInId: checkin.id,
                attachmentId: new unique_entity_id_1.UniqueEntityID(attachmentId),
            });
        });
        checkin.attachments = new check_in_attachment_list_1.CheckInAttachmentList(checkInAttachments);
        await this.checkInsRepository.create(checkin);
        return (0, either_1.right)({
            checkin,
        });
    }
};
exports.CheckInUseCase = CheckInUseCase;
exports.CheckInUseCase = CheckInUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [check_ins_repository_1.CheckInsRepository])
], CheckInUseCase);
//# sourceMappingURL=check-in.js.map