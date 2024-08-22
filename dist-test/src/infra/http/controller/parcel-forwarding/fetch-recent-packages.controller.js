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
exports.FetchRecentPackagesController = void 0;
const common_1 = require("@nestjs/common");
const zod_validation_pipe_1 = require("../../pipe/zod-validation-pipe");
const zod_1 = require("zod");
const current_user_decorator_1 = require("../../../auth/current-user-decorator");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const not_allowed_error_1 = require("../../../../core/errors/errors/not-allowed-error");
const fetch_recent_packages_1 = require("../../../../domain/parcel-forwarding/application/use-cases/fetch-recent-packages");
const package_presenter_1 = require("../../presenters/package-presenter");
const pageQueryParamSchema = zod_1.z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(zod_1.z.number().min(1));
const queryValidationPipe = new zod_validation_pipe_1.ZodValidationPipe(pageQueryParamSchema);
let FetchRecentPackagesController = class FetchRecentPackagesController {
    fetchRecentPackages;
    constructor(fetchRecentPackages) {
        this.fetchRecentPackages = fetchRecentPackages;
    }
    async handle(user, page) {
        const userId = user.sub;
        const result = await this.fetchRecentPackages.execute({
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
        const packagesPreviews = result.value.packagePreview.map(package_presenter_1.PackagePresenter.toHTTP);
        return {
            packagesPreviews,
        };
    }
};
exports.FetchRecentPackagesController = FetchRecentPackagesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page', queryValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], FetchRecentPackagesController.prototype, "handle", null);
exports.FetchRecentPackagesController = FetchRecentPackagesController = __decorate([
    (0, common_1.Controller)('/packages'),
    __metadata("design:paramtypes", [fetch_recent_packages_1.FetchRecentPackagesUseCase])
], FetchRecentPackagesController);
//# sourceMappingURL=fetch-recent-packages.controller.js.map