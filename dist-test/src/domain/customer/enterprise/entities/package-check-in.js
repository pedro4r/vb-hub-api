"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageCheckIn = void 0;
const entity_1 = require("../../../../core/entities/entity");
class PackageCheckIn extends entity_1.Entity {
    get packageId() {
        return this.props.packageId;
    }
    get checkInId() {
        return this.props.checkInId;
    }
    static create(props, id) {
        const packageCheckIn = new PackageCheckIn(props, id);
        return packageCheckIn;
    }
}
exports.PackageCheckIn = PackageCheckIn;
//# sourceMappingURL=package-check-in.js.map