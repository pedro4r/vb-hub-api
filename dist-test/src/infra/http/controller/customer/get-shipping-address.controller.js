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
exports.GetShippingAddressController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../../auth/current-user-decorator");
const shipping_address_presenter_1 = require("../../presenters/shipping-address-presenter");
const get_shipping_address_1 = require("../../../../domain/customer/application/use-cases/get-shipping-address");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const not_allowed_error_1 = require("../../../../core/errors/errors/not-allowed-error");
let GetShippingAddressController = class GetShippingAddressController {
    getShippingAddressUseCase;
    constructor(getShippingAddressUseCase) {
        this.getShippingAddressUseCase = getShippingAddressUseCase;
    }
    async handle(user, shippingAddressId) {
        const userId = user.sub;
        const result = await this.getShippingAddressUseCase.execute({
            customerId: userId,
            shippingAddressId,
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
        const shippingAddress = result.value.shippingAddress;
        return {
            shippingAddress: shipping_address_presenter_1.ShippingAddressPresenter.toHTTP(shippingAddress),
        };
    }
};
exports.GetShippingAddressController = GetShippingAddressController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GetShippingAddressController.prototype, "handle", null);
exports.GetShippingAddressController = GetShippingAddressController = __decorate([
    (0, common_1.Controller)('/shipping-address/:id'),
    __metadata("design:paramtypes", [get_shipping_address_1.GetShippingAddressUseCase])
], GetShippingAddressController);
//# sourceMappingURL=get-shipping-address.controller.js.map