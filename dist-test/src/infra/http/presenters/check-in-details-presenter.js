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
exports.CheckInDetailsPresenter = void 0;
const env_service_1 = require("../../env/env.service");
const common_1 = require("@nestjs/common");
let CheckInDetailsPresenter = class CheckInDetailsPresenter {
    envService;
    constructor(envService) {
        this.envService = envService;
    }
    toHTTP(checkInDetails) {
        const r2DevURL = this.envService.get('CLOUDFLARE_DEV_URL');
        const attachments = checkInDetails.attachments.map((attachment) => `${r2DevURL}/${attachment.url}`);
        return {
            checkInId: checkInDetails.checkInId.toString(),
            parcelForwardingId: checkInDetails.parcelForwardingId.toString(),
            customerId: checkInDetails.customerId.toString(),
            hubId: checkInDetails.hubId,
            customerFirstName: checkInDetails.customerFirstName,
            customerLastName: checkInDetails.customerLastName,
            packageId: checkInDetails.packageId
                ? checkInDetails.packageId.toString()
                : null,
            details: checkInDetails.details ?? null,
            status: checkInDetails.status,
            attachments,
            weight: checkInDetails.weight ?? null,
            createdAt: checkInDetails.createdAt,
            updatedAt: checkInDetails.updatedAt ?? null,
        };
    }
};
exports.CheckInDetailsPresenter = CheckInDetailsPresenter;
exports.CheckInDetailsPresenter = CheckInDetailsPresenter = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [env_service_1.EnvService])
], CheckInDetailsPresenter);
//# sourceMappingURL=check-in-details-presenter.js.map