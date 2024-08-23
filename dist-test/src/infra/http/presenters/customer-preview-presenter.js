"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerPreviewPresenter = void 0;
class CustomerPreviewPresenter {
    static toHTTP(customerPreview) {
        return {
            customerId: customerPreview.customerId.toString(),
            hubId: customerPreview.hubId,
            firstName: customerPreview.firstName,
            lastName: customerPreview.lastName,
        };
    }
}
exports.CustomerPreviewPresenter = CustomerPreviewPresenter;
//# sourceMappingURL=customer-preview-presenter.js.map