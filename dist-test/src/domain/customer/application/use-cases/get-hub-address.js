"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetHubAddressUseCase = void 0;
const either_1 = require("../../../../core/either");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const not_allowed_error_1 = require("../../../../core/errors/errors/not-allowed-error");
const customer_hub_address_1 = require("../../enterprise/entities/value-objects/customer-hub-address");
class GetHubAddressUseCase {
    customerRepository;
    parcelForwardingAddressesRepository;
    shippingAddressRepository;
    constructor(customerRepository, parcelForwardingAddressesRepository, shippingAddressRepository) {
        this.customerRepository = customerRepository;
        this.parcelForwardingAddressesRepository = parcelForwardingAddressesRepository;
        this.shippingAddressRepository = shippingAddressRepository;
    }
    async execute({ customerId, }) {
        const shippingAddresses = await this.shippingAddressRepository.findManyByCustomerId(customerId);
        if (!shippingAddresses) {
            return (0, either_1.left)(new not_allowed_error_1.NotAllowedError('You must have a shipping address to get the hub address'));
        }
        const customer = await this.customerRepository.findById(customerId);
        if (!customer) {
            return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError());
        }
        if (customerId !== customer.id.toString()) {
            return (0, either_1.left)(new not_allowed_error_1.NotAllowedError());
        }
        const parcelForwardingAddressesRepository = await this.parcelForwardingAddressesRepository.findByParcelForwardingId(customer.parcelForwardingId.toString());
        if (!parcelForwardingAddressesRepository) {
            return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError());
        }
        const hubAddress = customer_hub_address_1.CustomerHubAddress.create({
            customerHubId: customer.hubId,
            parcelForwardingAddress: parcelForwardingAddressesRepository,
        });
        return (0, either_1.right)({
            hubAddress,
        });
    }
}
exports.GetHubAddressUseCase = GetHubAddressUseCase;
//# sourceMappingURL=get-hub-address.js.map