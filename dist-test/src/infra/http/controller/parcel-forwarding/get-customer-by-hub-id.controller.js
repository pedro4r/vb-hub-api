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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCustomerByHubIdController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../../auth/current-user-decorator");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const not_allowed_error_1 = require("../../../../core/errors/errors/not-allowed-error");
const get_customer_by_hub_id_1 = require("../../../../domain/parcel-forwarding/application/use-cases/get-customer-by-hub-id");
const customer_preview_presenter_1 = require("../../presenters/customer-preview-presenter");
let GetCustomerByHubIdController = class GetCustomerByHubIdController {
    getCustomerByHubIdUseCase;
    constructor(getCustomerByHubIdUseCase) {
        this.getCustomerByHubIdUseCase = getCustomerByHubIdUseCase;
    }
    async handle(user, hubId) {
        const userId = user.sub;
        const result = await this.getCustomerByHubIdUseCase.execute({
            parcelForwardingId: userId,
            hubId: Number(hubId),
        });
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case resource_not_found_error_1.ResourceNotFoundError:
                    throw new common_1.ConflictException(error.message);
                case not_allowed_error_1.NotAllowedError:
                    throw new common_1.ConflictException(error.message);
                default:
                    throw new common_1.BadRequestException(error.message);
            }
        }
        const customerPreview = customer_preview_presenter_1.CustomerPreviewPresenter.toHTTP(result.value.customerPreview);
        return {
            customerPreview,
        };
    }
};
exports.GetCustomerByHubIdController = GetCustomerByHubIdController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GetCustomerByHubIdController.prototype, "handle", null);
exports.GetCustomerByHubIdController = GetCustomerByHubIdController = __decorate([
    (0, common_1.Controller)('/customer/:id'),
    __metadata("design:paramtypes", [get_customer_by_hub_id_1.GetCustomerByHubIdUseCase])
], GetCustomerByHubIdController);
//# sourceMappingURL=get-customer-by-hub-id.controller.js.map