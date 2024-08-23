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
exports.FetchCustomersByNameUseCase = void 0;
const either_1 = require("../../../../core/either");
const not_allowed_error_1 = require("../../../../core/errors/errors/not-allowed-error");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const common_1 = require("@nestjs/common");
const customer_repository_1 = require("../../../customer/application/repositories/customer-repository");
let FetchCustomersByNameUseCase = class FetchCustomersByNameUseCase {
    customerRepository;
    constructor(customerRepository) {
        this.customerRepository = customerRepository;
    }
    async execute({ name, page, parcelForwardingId, }) {
        const customersData = await this.customerRepository.findManyByName(name, parcelForwardingId, page);
        if (customersData.customers.length === 0) {
            return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError());
        }
        if (parcelForwardingId !==
            customersData.customers[0].parcelForwardingId.toString()) {
            return (0, either_1.left)(new not_allowed_error_1.NotAllowedError());
        }
        return (0, either_1.right)({ customersData });
    }
};
exports.FetchCustomersByNameUseCase = FetchCustomersByNameUseCase;
exports.FetchCustomersByNameUseCase = FetchCustomersByNameUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [customer_repository_1.CustomerRepository])
], FetchCustomersByNameUseCase);
//# sourceMappingURL=fetch-customers-by-name.js.map