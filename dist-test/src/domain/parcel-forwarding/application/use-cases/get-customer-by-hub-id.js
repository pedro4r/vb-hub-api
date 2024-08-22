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
exports.GetCustomerByHubIdUseCase = void 0;
const either_1 = require("../../../../core/either");
const not_allowed_error_1 = require("../../../../core/errors/errors/not-allowed-error");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const common_1 = require("@nestjs/common");
const customer_repository_1 = require("../../../customer/application/repositories/customer-repository");
let GetCustomerByHubIdUseCase = class GetCustomerByHubIdUseCase {
    customerRepository;
    constructor(customerRepository) {
        this.customerRepository = customerRepository;
    }
    async execute({ hubId, parcelForwardingId, }) {
        const customerPreview = await this.customerRepository.findByHubId(hubId);
        if (!customerPreview) {
            return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError());
        }
        if (parcelForwardingId !== customerPreview.parcelForwardingId.toString()) {
            return (0, either_1.left)(new not_allowed_error_1.NotAllowedError());
        }
        return (0, either_1.right)({ customerPreview });
    }
};
exports.GetCustomerByHubIdUseCase = GetCustomerByHubIdUseCase;
exports.GetCustomerByHubIdUseCase = GetCustomerByHubIdUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [customer_repository_1.CustomerRepository])
], GetCustomerByHubIdUseCase);
//# sourceMappingURL=get-customer-by-hub-id.js.map