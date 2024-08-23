"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageCheckInsList = void 0;
const watched_list_1 = require("../../../../core/entities/watched-list");
class PackageCheckInsList extends watched_list_1.WatchedList {
    compareItems(a, b) {
        return a.checkInId.equals(b.checkInId) && a.packageId.equals(b.packageId);
    }
}
exports.PackageCheckInsList = PackageCheckInsList;
//# sourceMappingURL=package-check-ins-list.js.map