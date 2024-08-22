"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaCustomerRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const customer_preview_1 = require("../../../../domain/customer/enterprise/entities/value-objects/customer-preview");
const prisma_customer_mapper_1 = require("../mappers/prisma-customer-mapper");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const fetch_customers_by_name_data_1 = require("../../../../domain/customer/enterprise/entities/value-objects/fetch-customers-by-name-data");
let PrismaCustomerRepository = class PrismaCustomerRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findManyByName(name, parcelForwardingId, page) {
        const totalCustomers = await this.prisma.customer.count({
            where: {
                parcelForwardingId,
                OR: [
                    {
                        firstName: {
                            contains: name,
                            mode: 'insensitive',
                        },
                    },
                    {
                        lastName: {
                            contains: name,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
        });
        const customers = await this.prisma.customer.findMany({
            where: {
                parcelForwardingId,
                OR: [
                    {
                        firstName: {
                            contains: name,
                            mode: 'insensitive',
                        },
                    },
                    {
                        lastName: {
                            contains: name,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
            take: 5,
            skip: (page - 1) * 5,
        });
        const customersToDomain = customers.map((customer) => prisma_customer_mapper_1.PrismaCustomerMapper.toDomain(customer));
        return fetch_customers_by_name_data_1.FetchCustomerByNameData.create({
            customers: customersToDomain.map((customer) => customer_preview_1.CustomerPreview.create({
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
                totalCount: totalCustomers,
            },
        });
    }
    async findByEmail(email) {
        const customer = await this.prisma.customer.findUnique({
            where: {
                email,
            },
        });
        return customer ? prisma_customer_mapper_1.PrismaCustomerMapper.toDomain(customer) : null;
    }
    async findById(id) {
        const customer = await this.prisma.customer.findUnique({
            where: {
                id,
            },
        });
        return customer ? prisma_customer_mapper_1.PrismaCustomerMapper.toDomain(customer) : null;
    }
    async findByHubId(hubId) {
        const customer = await this.prisma.customer.findUnique({
            where: {
                hubId,
            },
        });
        if (!customer)
            return null;
        const customerPreview = customer_preview_1.CustomerPreview.create({
            customerId: new unique_entity_id_1.UniqueEntityID(customer.id),
            hubId: customer.hubId,
            firstName: customer.firstName,
            lastName: customer.lastName,
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID(customer.parcelForwardingId),
            createdAt: customer.createdAt,
        });
        return customerPreview;
    }
    async create(customer) {
        const data = prisma_customer_mapper_1.PrismaCustomerMapper.toPrisma(customer);
        await this.prisma.customer.create({
            data,
        });
    }
    async countParcelForwardingCustomers(parcelForwardingId) {
        return this.prisma.customer.count({
            where: {
                parcelForwardingId,
            },
        });
    }
};
exports.PrismaCustomerRepository = PrismaCustomerRepository;
exports.PrismaCustomerRepository = PrismaCustomerRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaCustomerRepository);
//# sourceMappingURL=prisma-customers-repository.js.map