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
exports.EditShippingAddressUseCase = void 0;
const either_1 = require("../../../../core/either");
const not_allowed_error_1 = require("../../../../core/errors/errors/not-allowed-error");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const shipping_address_repository_1 = require("../repositories/shipping-address-repository");
const address_1 = require("../../../../core/value-objects/address");
const common_1 = require("@nestjs/common");
let EditShippingAddressUseCase = class EditShippingAddressUseCase {
    shippingAddressRepository;
    constructor(shippingAddressRepository) {
        this.shippingAddressRepository = shippingAddressRepository;
    }
    async execute({ shippingAddressId, customerId, recipientName, address, complement, city, state, zipcode, country, phoneNumber, email, taxId, }) {
        const shippingAddress = await this.shippingAddressRepository.findById(shippingAddressId);
        if (!shippingAddress) {
            return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError('Shipping address not found.'));
        }
        if (customerId !== shippingAddress.customerId.toString()) {
            return (0, either_1.left)(new not_allowed_error_1.NotAllowedError('You are not allowed to edit this shipping address.'));
        }
        shippingAddress.recipientName = recipientName;
        shippingAddress.phoneNumber = phoneNumber;
        shippingAddress.email = email;
        shippingAddress.taxId = taxId;
        const newAddress = new address_1.Address({
            address,
            city,
            state,
            zipcode,
            country,
            complement,
        });
        shippingAddress.address = newAddress;
        await this.shippingAddressRepository.save(shippingAddress);
        return (0, either_1.right)({
            shippingAddress,
        });
    }
};
exports.EditShippingAddressUseCase = EditShippingAddressUseCase;
exports.EditShippingAddressUseCase = EditShippingAddressUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [shipping_address_repository_1.ShippingAddressRepository])
], EditShippingAddressUseCase);
//# sourceMappingURL=edit-shipping-address.js.map