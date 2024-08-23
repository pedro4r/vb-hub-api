"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerModule = void 0;
const cryptograph_module_1 = require("../../cryptograph/cryptograph.module");
const database_module_1 = require("../../database/database.module");
const storage_module_1 = require("../../storage/storage.module");
const common_1 = require("@nestjs/common");
const create_shipping_address_controller_1 = require("./customer/create-shipping-address.controller");
const create_declaration_model_controller_1 = require("./customer/create-declaration-model.controller");
const create_package_controller_1 = require("./customer/create-package.controller");
const edit_shipping_address_controller_1 = require("./customer/edit-shipping-address.controller");
const delete_shipping_address_controller_1 = require("./customer/delete-shipping-address.controller");
const fetch_shipping_address_controller_1 = require("./customer/fetch-shipping-address.controller");
const get_shipping_address_controller_1 = require("./customer/get-shipping-address.controller");
const edit_declaration_model_controller_1 = require("./customer/edit-declaration-model.controller");
const delete_declaration_model_controller_1 = require("./customer/delete-declaration-model.controller");
const fetch_declaration_models_controller_1 = require("./customer/fetch-declaration-models.controller");
const get_declaration_model_controller_1 = require("./customer/get-declaration-model.controller");
const create_shipping_address_1 = require("../../../domain/customer/application/use-cases/create-shipping-address");
const create_declaration_model_1 = require("../../../domain/customer/application/use-cases/create-declaration-model");
const create_package_1 = require("../../../domain/customer/application/use-cases/create-package");
const edit_shipping_address_1 = require("../../../domain/customer/application/use-cases/edit-shipping-address");
const delete_shipping_address_1 = require("../../../domain/customer/application/use-cases/delete-shipping-address");
const fetch_shipping_address_1 = require("../../../domain/customer/application/use-cases/fetch-shipping-address");
const get_shipping_address_1 = require("../../../domain/customer/application/use-cases/get-shipping-address");
const edit_declaration_model_1 = require("../../../domain/customer/application/use-cases/edit-declaration-model");
const delete_declaration_model_1 = require("../../../domain/customer/application/use-cases/delete-declaration-model");
const fetch_declaration_model_1 = require("../../../domain/customer/application/use-cases/fetch-declaration-model");
const get_declaration_model_1 = require("../../../domain/customer/application/use-cases/get-declaration-model");
let CustomerModule = class CustomerModule {
};
exports.CustomerModule = CustomerModule;
exports.CustomerModule = CustomerModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, cryptograph_module_1.CryptographyModule, storage_module_1.StorageModule],
        controllers: [
            create_shipping_address_controller_1.CreateShippingAddressController,
            create_declaration_model_controller_1.CreateDeclarationModelController,
            create_package_controller_1.CreatePackageController,
            edit_shipping_address_controller_1.EditShippingAddressController,
            delete_shipping_address_controller_1.DeleteShippingAddressController,
            fetch_shipping_address_controller_1.FetchShippingAddressController,
            get_shipping_address_controller_1.GetShippingAddressController,
            edit_declaration_model_controller_1.EditDeclarationModelController,
            delete_declaration_model_controller_1.DeleteDeclarationModelController,
            fetch_declaration_models_controller_1.FetchDeclarationModelsController,
            get_declaration_model_controller_1.GetDeclarationModelController,
        ],
        providers: [
            create_shipping_address_1.CreateShippingAddressUseCase,
            create_declaration_model_1.CreateDeclarationModelUseCase,
            create_package_1.CreatePackageUseCase,
            edit_shipping_address_1.EditShippingAddressUseCase,
            delete_shipping_address_1.DeleteShippingAddressUseCase,
            fetch_shipping_address_1.FetchShippingAddressUseCase,
            get_shipping_address_1.GetShippingAddressUseCase,
            edit_declaration_model_1.EditDeclarationModelUseCase,
            delete_declaration_model_1.DeleteDeclarationModelUseCase,
            fetch_declaration_model_1.FetchDeclarationModelsUseCase,
            get_declaration_model_1.GetDeclarationModelUseCase,
        ],
    })
], CustomerModule);
//# sourceMappingURL=customer.module.js.map