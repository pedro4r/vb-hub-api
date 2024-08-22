"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateParcelForwardingAddressUseCase = void 0;
const either_1 = require("../../../../core/either");
const forwarding_address_1 = require("../../enterprise/entities/forwarding-address");
const address_1 = require("../../../../core/value-objects/address");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
class CreateParcelForwardingAddressUseCase {
    parcelForwardingAddressesRepository;
    constructor(parcelForwardingAddressesRepository) {
        this.parcelForwardingAddressesRepository = parcelForwardingAddressesRepository;
    }
    async execute({ parcelForwardingId, address, complement, city, state, zipcode, country, }) {
        const addressInfo = new address_1.Address({
            address,
            complement,
            city,
            state,
            zipcode,
            country,
        });
        const parcelForwardingAddress = forwarding_address_1.ParcelForwardingAddress.create({
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID(parcelForwardingId),
            address: addressInfo,
        });
        await this.parcelForwardingAddressesRepository.create(parcelForwardingAddress);
        return (0, either_1.right)({
            parcelForwardingAddress,
        });
    }
}
exports.CreateParcelForwardingAddressUseCase = CreateParcelForwardingAddressUseCase;
//# sourceMappingURL=create-parcel-forwarding-address.js.map