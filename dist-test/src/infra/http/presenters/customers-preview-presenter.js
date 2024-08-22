"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersPreviewPresenter = void 0;
class CustomersPreviewPresenter {
    static toHTTP(customersData) {
        const customers = customersData.customers.map((customer) => {
            return {
                hubId: customer.hubId,
                customerId: customer.customerId.toString(),
                parcelForwardingId: customer.parcelForwardingId.toString(),
                firstName: customer.firstName,
                lastName: customer.lastName,
                createdAt: customer.createdAt,
            };
        });
        const customersPreview = {
            customers,
            meta: {
                pageIndex: customersData.meta.pageIndex,
                perPage: customersData.meta.perPage,
                totalCount: customersData.meta.totalCount,
            },
        };
        return customersPreview;
    }
}
exports.CustomersPreviewPresenter = CustomersPreviewPresenter;
//# sourceMappingURL=customers-preview-presenter.js.map