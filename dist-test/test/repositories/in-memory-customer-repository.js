"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryCustomerRepository = void 0;
const customer_preview_1 = require("../../src/domain/customer/enterprise/entities/value-objects/customer-preview");
const fetch_customers_by_name_data_1 = require("../../src/domain/customer/enterprise/entities/value-objects/fetch-customers-by-name-data");
class InMemoryCustomerRepository {
    items = [];
    async findManyByName(name, parcelForwardingId, page) {
        const lowerCaseName = name.toLowerCase();
        const totalCustomers = this.items.filter((item) => item.parcelForwardingId.toString() === parcelForwardingId &&
            (item.firstName.toLowerCase().includes(lowerCaseName) ||
                item.lastName.toLowerCase().includes(lowerCaseName)));
        const customers = totalCustomers.slice((page - 1) * 5, page * 5);
        return fetch_customers_by_name_data_1.FetchCustomerByNameData.create({
            customers: customers.map((customer) => customer_preview_1.CustomerPreview.create({
                hubId: customer.hubId,
                parcelForwardingId: customer.parcelForwardingId,
                firstName: customer.firstName,
                lastName: customer.lastName,
                customerId: customer.id,
                createdAt: customer.createdAt,
            })),
            meta: {
                pageIndex: page,
                perPage: 5,
                totalCount: totalCustomers.length,
            },
        });
    }
    async findByHubId(hubId) {
        const customer = this.items.find((item) => item.hubId === hubId);
        if (!customer) {
            return null;
        }
        return customer_preview_1.CustomerPreview.create({
            hubId: customer.hubId,
            parcelForwardingId: customer.parcelForwardingId,
            firstName: customer.firstName,
            lastName: customer.lastName,
            customerId: customer.id,
            createdAt: customer.createdAt,
        });
    }
    async countParcelForwardingCustomers(parcelForwardingId) {
        return this.items.filter((item) => item.parcelForwardingId.toString() === parcelForwardingId).length;
    }
    async findById(id) {
        const customer = this.items.find((item) => item.id.toString() === id);
        if (!customer) {
            return null;
        }
        return customer;
    }
    async findByEmail(email) {
        const customer = this.items.find((item) => item.email === email);
        if (!customer) {
            return null;
        }
        return customer;
    }
    async create(customer) {
        this.items.push(customer);
    }
}
exports.InMemoryCustomerRepository = InMemoryCustomerRepository;
//# sourceMappingURL=in-memory-customer-repository.js.map