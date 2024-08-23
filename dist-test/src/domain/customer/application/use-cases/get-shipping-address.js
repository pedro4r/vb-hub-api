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
exports.GetShippingAddressUseCase = void 0;
const either_1 = require("../../../../core/either");
const shipping_address_repository_1 = require("../repositories/shipping-address-repository");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const not_allowed_error_1 = require("../../../../core/errors/errors/not-allowed-error");
const common_1 = require("@nestjs/common");
let GetShippingAddressUseCase = class GetShippingAddressUseCase {
    shippingAddressRepository;
    constructor(shippingAddressRepository) {
        this.shippingAddressRepository = shippingAddressRepository;
    }
    async execute({ customerId, shippingAddressId, }) {
        const shippingAddress = await this.shippingAddressRepository.findById(shippingAddressId);
        if (!shippingAddress) {
            return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError('Shipping address not found.'));
        }
        if (customerId !== shippingAddress.customerId.toString()) {
            return (0, either_1.left)(new not_allowed_error_1.NotAllowedError('You are not allowed to fetch this shipping address.'));
        }
        return (0, either_1.right)({
            shippingAddress,
        });
    }
};
exports.GetShippingAddressUseCase = GetShippingAddressUseCase;
exports.GetShippingAddressUseCase = GetShippingAddressUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [shipping_address_repository_1.ShippingAddressRepository])
], GetShippingAddressUseCase);
//# sourceMappingURL=get-shipping-address.js.map