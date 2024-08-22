"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpModule = void 0;
const common_1 = require("@nestjs/common");
const cryptograph_module_1 = require("../cryptograph/cryptograph.module");
const database_module_1 = require("../database/database.module");
const storage_module_1 = require("../storage/storage.module");
const customer_module_1 = require("./controller/customer.module");
const parcel_forwarding_module_1 = require("./controller/parcel-forwarding.module");
const auth_module_1 = require("../auth/auth.module");
let HttpModule = class HttpModule {
};
exports.HttpModule = HttpModule;
exports.HttpModule = HttpModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            cryptograph_module_1.CryptographyModule,
            storage_module_1.StorageModule,
            customer_module_1.CustomerModule,
            parcel_forwarding_module_1.ParcelForwardingModule,
            auth_module_1.AuthModule,
        ],
    })
], HttpModule);
//# sourceMappingURL=http.module.js.map