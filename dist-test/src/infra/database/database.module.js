"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma/prisma.service");
const prisma_check_ins_repository_1 = require("./prisma/repositories/prisma-check-ins-repository");
const check_ins_repository_1 = require("../../domain/parcel-forwarding/application/repositories/check-ins-repository");
const parcel_forwardings_repository_1 = require("../../domain/parcel-forwarding/application/repositories/parcel-forwardings-repository");
const prisma_parcel_forwardings_repository_1 = require("./prisma/repositories/prisma-parcel-forwardings-repository");
const shipping_address_repository_1 = require("../../domain/customer/application/repositories/shipping-address-repository");
const declaration_model_repository_1 = require("../../domain/customer/application/repositories/declaration-model-repository");
const prisma_shipping_addresses_repository_1 = require("./prisma/repositories/prisma-shipping-addresses-repository");
const prisma_declaration_models_repository_1 = require("./prisma/repositories/prisma-declaration-models-repository");
const declaration_model_item_repository_1 = require("../../domain/customer/application/repositories/declaration-model-item-repository");
const prisma_declaration_model_items_repository_1 = require("./prisma/repositories/prisma-declaration-model-items-repository");
const prisma_package_repository_1 = require("./prisma/repositories/prisma-package-repository");
const package_repository_1 = require("../../domain/customer/application/repositories/package-repository");
const package_shipping_address_repository_1 = require("../../domain/customer/application/repositories/package-shipping-address-repository");
const prisma_package_shipping_address_repository_1 = require("./prisma/repositories/prisma-package-shipping-address-repository");
const attachments_repository_1 = require("../../domain/parcel-forwarding/application/repositories/attachments-repository");
const prisma_attachments_repository_1 = require("./prisma/repositories/prisma-attachments-repository");
const check_in_attachments_repository_1 = require("../../domain/parcel-forwarding/application/repositories/check-in-attachments-repository");
const prisma_check_in_attachments_repository_1 = require("./prisma/repositories/prisma-check-in-attachments-repository");
const customer_repository_1 = require("../../domain/customer/application/repositories/customer-repository");
const prisma_customers_repository_1 = require("./prisma/repositories/prisma-customers-repository");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        providers: [
            prisma_service_1.PrismaService,
            {
                provide: customer_repository_1.CustomerRepository,
                useClass: prisma_customers_repository_1.PrismaCustomerRepository,
            },
            {
                provide: check_ins_repository_1.CheckInsRepository,
                useClass: prisma_check_ins_repository_1.PrismaCheckInsRepository,
            },
            {
                provide: shipping_address_repository_1.ShippingAddressRepository,
                useClass: prisma_shipping_addresses_repository_1.PrismaShippingAddressesRepository,
            },
            {
                provide: parcel_forwardings_repository_1.ParcelForwardingsRepository,
                useClass: prisma_parcel_forwardings_repository_1.PrismaParcelForwardingRepository,
            },
            {
                provide: declaration_model_repository_1.DeclarationModelRepository,
                useClass: prisma_declaration_models_repository_1.PrismaDeclarationModelsRepository,
            },
            {
                provide: declaration_model_item_repository_1.DeclarationModelItemsRepository,
                useClass: prisma_declaration_model_items_repository_1.PrismaDeclarationModelItemsRepository,
            },
            {
                provide: package_repository_1.PackageRepository,
                useClass: prisma_package_repository_1.PrismaPackageRepository,
            },
            {
                provide: package_shipping_address_repository_1.PackageShippingAddressRepository,
                useClass: prisma_package_shipping_address_repository_1.PrismaPackageShippingAddressRepository,
            },
            {
                provide: attachments_repository_1.AttachmentsRepository,
                useClass: prisma_attachments_repository_1.PrismaAttachmentsRepository,
            },
            {
                provide: check_in_attachments_repository_1.CheckInAttachmentsRepository,
                useClass: prisma_check_in_attachments_repository_1.PrismaCheckInAttachmentsRepository,
            },
        ],
        exports: [
            prisma_service_1.PrismaService,
            check_ins_repository_1.CheckInsRepository,
            parcel_forwardings_repository_1.ParcelForwardingsRepository,
            shipping_address_repository_1.ShippingAddressRepository,
            declaration_model_repository_1.DeclarationModelRepository,
            declaration_model_item_repository_1.DeclarationModelItemsRepository,
            package_repository_1.PackageRepository,
            package_shipping_address_repository_1.PackageShippingAddressRepository,
            attachments_repository_1.AttachmentsRepository,
            check_in_attachments_repository_1.CheckInAttachmentsRepository,
            customer_repository_1.CustomerRepository,
        ],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map