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
exports.FetchCustomersByNameController = void 0;
const common_1 = require("@nestjs/common");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const not_allowed_error_1 = require("../../../../core/errors/errors/not-allowed-error");
const fetch_customers_by_name_1 = require("../../../../domain/parcel-forwarding/application/use-cases/fetch-customers-by-name");
const zod_validation_pipe_1 = require("../../pipe/zod-validation-pipe");
const zod_1 = require("zod");
const customers_preview_presenter_1 = require("../../presenters/customers-preview-presenter");
const current_user_decorator_1 = require("../../../auth/current-user-decorator");
const routeParamsSchema = zod_1.z.object({
    name: zod_1.z.string(),
});
const queryParamsSchema = zod_1.z.object({
    page: zod_1.z
        .string()
        .optional()
        .default('1')
        .transform(Number)
        .pipe(zod_1.z.number().min(1)),
});
const routeParamsValidationPipe = new zod_validation_pipe_1.ZodValidationPipe(routeParamsSchema);
const queryParamsValidationPipe = new zod_validation_pipe_1.ZodValidationPipe(queryParamsSchema);
let FetchCustomersByNameController = class FetchCustomersByNameController {
    fetchCustomersByNameUseCase;
    constructor(fetchCustomersByNameUseCase) {
        this.fetchCustomersByNameUseCase = fetchCustomersByNameUseCase;
    }
    async handle(user, param, queryParams) {
        const userId = user.sub;
        const { name } = param;
        const { page } = queryParams;
        const result = await this.fetchCustomersByNameUseCase.execute({
            parcelForwardingId: userId,
            name,
            page,
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
        const customersPreview = customers_preview_presenter_1.CustomersPreviewPresenter.toHTTP(result.value.customersData);
        return {
            customersPreview,
        };
    }
};
exports.FetchCustomersByNameController = FetchCustomersByNameController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)(routeParamsValidationPipe)),
    __param(2, (0, common_1.Query)(queryParamsValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FetchCustomersByNameController.prototype, "handle", null);
exports.FetchCustomersByNameController = FetchCustomersByNameController = __decorate([
    (0, common_1.Controller)('/customers/:name'),
    __metadata("design:paramtypes", [fetch_customers_by_name_1.FetchCustomersByNameUseCase])
], FetchCustomersByNameController);
//# sourceMappingURL=fetch-customers-by-name.controller.js.map