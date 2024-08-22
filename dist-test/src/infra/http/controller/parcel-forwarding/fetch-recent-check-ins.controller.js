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
exports.FetchRecentCheckInsController = void 0;
const common_1 = require("@nestjs/common");
const zod_validation_pipe_1 = require("../../pipe/zod-validation-pipe");
const zod_1 = require("zod");
const fetch_recent_check_ins_1 = require("../../../../domain/parcel-forwarding/application/use-cases/fetch-recent-check-ins");
const current_user_decorator_1 = require("../../../auth/current-user-decorator");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const not_allowed_error_1 = require("../../../../core/errors/errors/not-allowed-error");
const check_in_presenter_1 = require("../../presenters/check-in-presenter");
const pageQueryParamSchema = zod_1.z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(zod_1.z.number().min(1));
const queryValidationPipe = new zod_validation_pipe_1.ZodValidationPipe(pageQueryParamSchema);
let FetchRecentCheckInsController = class FetchRecentCheckInsController {
    fetchRecentCheckIns;
    constructor(fetchRecentCheckIns) {
        this.fetchRecentCheckIns = fetchRecentCheckIns;
    }
    async handle(user, page) {
        const userId = user.sub;
        const result = await this.fetchRecentCheckIns.execute({
            parcelForwardingId: userId,
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
        const checkInsPreview = result.value.checkInsPreview.map(check_in_presenter_1.CheckInPresenter.toHTTP);
        return {
            checkInsPreview,
        };
    }
};
exports.FetchRecentCheckInsController = FetchRecentCheckInsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page', queryValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], FetchRecentCheckInsController.prototype, "handle", null);
exports.FetchRecentCheckInsController = FetchRecentCheckInsController = __decorate([
    (0, common_1.Controller)('/check-ins'),
    __metadata("design:paramtypes", [fetch_recent_check_ins_1.FetchRecentCheckInsUseCase])
], FetchRecentCheckInsController);
//# sourceMappingURL=fetch-recent-check-ins.controller.js.map