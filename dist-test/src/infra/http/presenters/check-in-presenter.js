"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInPresenter = void 0;
class CheckInPresenter {
    static toHTTP(checkInPreview) {
        return {
            checkInId: checkInPreview.checkInId.toString(),
            parcelForwardingId: checkInPreview.parcelForwardingId.toString(),
            customerId: checkInPreview.customerId.toString(),
            hubId: checkInPreview.hubId,
            customerFirstName: checkInPreview.customerFirstName,
            customerLastName: checkInPreview.customerLastName,
            packageId: checkInPreview.packageId?.toString() || null,
            status: checkInPreview.status,
            weight: checkInPreview.weight || null,
            createdAt: checkInPreview.createdAt,
            updatedAt: checkInPreview.updatedAt || null,
        };
    }
}
exports.CheckInPresenter = CheckInPresenter;
//# sourceMappingURL=check-in-presenter.js.map