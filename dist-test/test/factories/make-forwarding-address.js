"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeParcelForwardingAddress = makeParcelForwardingAddress;
const unique_entity_id_1 = require("../../src/core/entities/unique-entity-id");
const forwarding_address_1 = require("../../src/domain/parcel-forwarding/enterprise/entities/forwarding-address");
const make_address_1 = require("./make-address");
function makeParcelForwardingAddress(override = {}, id) {
    const parcelForwardingAddress = forwarding_address_1.ParcelForwardingAddress.create({
        parcelForwardingId: new unique_entity_id_1.UniqueEntityID(),
        address: (0, make_address_1.makeAddress)(),
        ...override,
    }, id);
    return parcelForwardingAddress;
}
//# sourceMappingURL=make-forwarding-address.js.map