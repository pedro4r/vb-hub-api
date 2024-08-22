"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackagePresenter = void 0;
class PackagePresenter {
    static toHTTP(packagePreview) {
        return {
            packageId: packagePreview.packageId.toString(),
            parcelForwardingId: packagePreview.parcelForwardingId.toString(),
            customerId: packagePreview.customerId.toString(),
            hubId: packagePreview.hubId,
            customerFirstName: packagePreview.customerFirstName,
            customerLastName: packagePreview.customerLastName,
            weight: packagePreview.weight || null,
            trackingNumber: packagePreview.trackingNumber || null,
            hasBattery: packagePreview.hasBattery,
            createdAt: packagePreview.createdAt,
            updatedAt: packagePreview.updatedAt || null,
        };
    }
}
exports.PackagePresenter = PackagePresenter;
//# sourceMappingURL=package-presenter.js.map