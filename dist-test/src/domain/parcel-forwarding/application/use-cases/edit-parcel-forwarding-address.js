"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditParcelForwardingAddressUseCase = void 0;
const either_1 = require("../../../../core/either");
const not_allowed_error_1 = require("../../../../core/errors/errors/not-allowed-error");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const address_1 = require("../../../../core/value-objects/address");
class EditParcelForwardingAddressUseCase {
    parcelForwardingAddressesRepository;
    constructor(parcelForwardingAddressesRepository) {
        this.parcelForwardingAddressesRepository = parcelForwardingAddressesRepository;
    }
    async execute({ parcelForwardingId, parcelForwardingAddressId, address, complement, city, state, zipcode, country, }) {
        const parcelForwardingAddress = await this.parcelForwardingAddressesRepository.findById(parcelForwardingAddressId);
        if (!parcelForwardingAddress) {
            return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError());
        }
        if (parcelForwardingId !==
            parcelForwardingAddress.parcelForwardingId.toString()) {
            return (0, either_1.left)(new not_allowed_error_1.NotAllowedError());
        }
        const newAddress = new address_1.Address({
            address,
            city,
            state,
            zipcode,
            country,
            complement,
        });
        parcelForwardingAddress.address = newAddress;
        await this.parcelForwardingAddressesRepository.save(parcelForwardingAddress);
        return (0, either_1.right)({
            parcelForwardingAddress,
        });
    }
}
exports.EditParcelForwardingAddressUseCase = EditParcelForwardingAddressUseCase;
//# sourceMappingURL=edit-parcel-forwarding-address.js.map