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
exports.CreateShippingAddressUseCase = void 0;
const either_1 = require("../../../../core/either");
const shipping_address_repository_1 = require("../repositories/shipping-address-repository");
const address_1 = require("../../../../core/value-objects/address");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const shipping_address_1 = require("../../enterprise/entities/shipping-address");
const common_1 = require("@nestjs/common");
let CreateShippingAddressUseCase = class CreateShippingAddressUseCase {
    shippingAddressRepository;
    constructor(shippingAddressRepository) {
        this.shippingAddressRepository = shippingAddressRepository;
    }
    async execute({ customerId, recipientName, address, complement, city, state, zipcode, country, phoneNumber, email, taxId, }) {
        const addressInfo = new address_1.Address({
            address,
            complement,
            city,
            state,
            zipcode,
            country,
        });
        const shippingAddress = shipping_address_1.ShippingAddress.create({
            customerId: new unique_entity_id_1.UniqueEntityID(customerId),
            recipientName,
            phoneNumber,
            email,
            taxId,
            address: addressInfo,
        });
        await this.shippingAddressRepository.create(shippingAddress);
        return (0, either_1.right)({
            shippingAddress,
        });
    }
};
exports.CreateShippingAddressUseCase = CreateShippingAddressUseCase;
exports.CreateShippingAddressUseCase = CreateShippingAddressUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [shipping_address_repository_1.ShippingAddressRepository])
], CreateShippingAddressUseCase);
//# sourceMappingURL=create-shipping-address.js.map