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
exports.CreateShippingAddressController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../../auth/current-user-decorator");
const zod_validation_pipe_1 = require("../../pipe/zod-validation-pipe");
const zod_1 = require("zod");
const create_shipping_address_1 = require("../../../../domain/customer/application/use-cases/create-shipping-address");
const createShippingAddressBodySchema = zod_1.z.object({
    recipientName: zod_1.z.string(),
    taxId: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
    phoneNumber: zod_1.z.string().optional(),
    address: zod_1.z.string(),
    complement: zod_1.z.string().optional(),
    city: zod_1.z.string(),
    state: zod_1.z.string(),
    zipcode: zod_1.z.string(),
    country: zod_1.z.string(),
});
const bodyValidationPipe = new zod_validation_pipe_1.ZodValidationPipe(createShippingAddressBodySchema);
let CreateShippingAddressController = class CreateShippingAddressController {
    createShippingAddressUseCase;
    constructor(createShippingAddressUseCase) {
        this.createShippingAddressUseCase = createShippingAddressUseCase;
    }
    async handle(body, user) {
        const { recipientName, taxId, email, phoneNumber, address, complement, city, state, zipcode, country, } = body;
        const userId = user.sub;
        const result = await this.createShippingAddressUseCase.execute({
            customerId: userId,
            recipientName,
            taxId,
            email,
            phoneNumber,
            address,
            complement,
            city,
            state,
            zipcode,
            country,
        });
        if (result.isLeft()) {
            throw new common_1.BadRequestException();
        }
    }
};
exports.CreateShippingAddressController = CreateShippingAddressController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(bodyValidationPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CreateShippingAddressController.prototype, "handle", null);
exports.CreateShippingAddressController = CreateShippingAddressController = __decorate([
    (0, common_1.Controller)('/shipping-address'),
    __metadata("design:paramtypes", [create_shipping_address_1.CreateShippingAddressUseCase])
], CreateShippingAddressController);
//# sourceMappingURL=create-shipping-address.controller.js.map