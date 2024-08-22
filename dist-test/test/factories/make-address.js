"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAddress = makeAddress;
const address_1 = require("../../src/core/value-objects/address");
const faker_1 = require("@faker-js/faker");
function makeAddress() {
    const address = new address_1.Address({
        address: faker_1.faker.location.streetAddress(),
        complement: faker_1.faker.location.secondaryAddress(),
        state: faker_1.faker.location.state(),
        zipcode: faker_1.faker.location.zipCode(),
        country: faker_1.faker.location.country(),
        city: faker_1.faker.location.city(),
    });
    return address;
}
//# sourceMappingURL=make-address.js.map