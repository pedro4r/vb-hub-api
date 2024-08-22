"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelForwarding = void 0;
const entity_1 = require("../../../../core/entities/entity");
class ParcelForwarding extends entity_1.Entity {
    get name() {
        return this.props.name;
    }
    get initials() {
        return this.props.initials;
    }
    get email() {
        return this.props.email;
    }
    get password() {
        return this.props.password;
    }
    static create(props, id) {
        const parcelForwarding = new ParcelForwarding(props, id);
        return parcelForwarding;
    }
}
exports.ParcelForwarding = ParcelForwarding;
//# sourceMappingURL=parcel-forwarding.js.map