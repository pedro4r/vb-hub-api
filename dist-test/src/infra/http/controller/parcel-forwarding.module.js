"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelForwardingModule = void 0;
const cryptograph_module_1 = require("../../cryptograph/cryptograph.module");
const database_module_1 = require("../../database/database.module");
const storage_module_1 = require("../../storage/storage.module");
const common_1 = require("@nestjs/common");
const register_parcel_forwarding_controller_1 = require("./parcel-forwarding/register-parcel-forwarding.controller");
const authenticate_controller_1 = require("./parcel-forwarding/authenticate.controller");
const create_check_in_controller_1 = require("./parcel-forwarding/create-check-in.controller");
const fetch_recent_check_ins_controller_1 = require("./parcel-forwarding/fetch-recent-check-ins.controller");
const upload_attachment_controller_1 = require("./parcel-forwarding/upload-attachment.controller");
const delete_check_in_controller_1 = require("./parcel-forwarding/delete-check-in.controller");
const get_check_in_controller_1 = require("./parcel-forwarding/get-check-in.controller");
const edit_check_in_controller_1 = require("./parcel-forwarding/edit-check-in.controller");
const fetch_recent_check_ins_details_controller_1 = require("./parcel-forwarding/fetch-recent-check-ins-details.controller");
const fetch_recent_packages_controller_1 = require("./parcel-forwarding/fetch-recent-packages.controller");
const get_package_controller_1 = require("./parcel-forwarding/get-package.controller");
const get_package_check_ins_details_controller_1 = require("./parcel-forwarding/get-package-check-ins-details.controller");
const check_in_1 = require("../../../domain/parcel-forwarding/application/use-cases/check-in");
const authenticate_parcel_forwarding_1 = require("../../../domain/parcel-forwarding/application/use-cases/authenticate-parcel-forwarding");
const register_parcel_forwarding_1 = require("../../../domain/parcel-forwarding/application/use-cases/register-parcel-forwarding");
const fetch_recent_check_ins_1 = require("../../../domain/parcel-forwarding/application/use-cases/fetch-recent-check-ins");
const upload_and_create_attachment_1 = require("../../../domain/parcel-forwarding/application/use-cases/upload-and-create-attachment");
const delete_check_in_1 = require("../../../domain/parcel-forwarding/application/use-cases/delete-check-in");
const get_check_in_1 = require("../../../domain/parcel-forwarding/application/use-cases/get-check-in");
const edit_check_in_1 = require("../../../domain/parcel-forwarding/application/use-cases/edit-check-in");
const fetch_recent_check_ins_details_1 = require("../../../domain/parcel-forwarding/application/use-cases/fetch-recent-check-ins-details");
const fetch_recent_packages_1 = require("../../../domain/parcel-forwarding/application/use-cases/fetch-recent-packages");
const get_package_1 = require("../../../domain/parcel-forwarding/application/use-cases/get-package");
const get_package_check_ins_details_1 = require("../../../domain/parcel-forwarding/application/use-cases/get-package-check-ins-details");
const test_route_controller_1 = require("./parcel-forwarding/test-route.controller");
const get_customer_by_hub_id_controller_1 = require("./parcel-forwarding/get-customer-by-hub-id.controller");
const get_customer_by_hub_id_1 = require("../../../domain/parcel-forwarding/application/use-cases/get-customer-by-hub-id");
const fetch_customers_by_name_controller_1 = require("./parcel-forwarding/fetch-customers-by-name.controller");
const fetch_customers_by_name_1 = require("../../../domain/parcel-forwarding/application/use-cases/fetch-customers-by-name");
const check_in_details_presenter_1 = require("../presenters/check-in-details-presenter");
const env_module_1 = require("../../env/env.module");
const token_verify_controller_1 = require("./parcel-forwarding/token-verify.controller");
const auth_module_1 = require("../../auth/auth.module");
let ParcelForwardingModule = class ParcelForwardingModule {
};
exports.ParcelForwardingModule = ParcelForwardingModule;
exports.ParcelForwardingModule = ParcelForwardingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            cryptograph_module_1.CryptographyModule,
            storage_module_1.StorageModule,
            env_module_1.EnvModule,
            auth_module_1.AuthModule,
        ],
        controllers: [
            register_parcel_forwarding_controller_1.RegisterParcelForwardingController,
            authenticate_controller_1.AuthenticateController,
            create_check_in_controller_1.CreateCheckInController,
            fetch_recent_check_ins_controller_1.FetchRecentCheckInsController,
            upload_attachment_controller_1.UploadAttachmentController,
            delete_check_in_controller_1.DeleteCheckInController,
            get_check_in_controller_1.GetCheckInController,
            edit_check_in_controller_1.EditCheckInController,
            fetch_recent_check_ins_details_controller_1.FetchRecentCheckInsDetailsController,
            fetch_recent_packages_controller_1.FetchRecentPackagesController,
            get_package_controller_1.GetPackageController,
            get_package_check_ins_details_controller_1.GetPackageCheckInsDetailsController,
            test_route_controller_1.TestController,
            get_customer_by_hub_id_controller_1.GetCustomerByHubIdController,
            fetch_customers_by_name_controller_1.FetchCustomersByNameController,
            token_verify_controller_1.VerifyTokenController,
        ],
        providers: [
            check_in_1.CheckInUseCase,
            authenticate_parcel_forwarding_1.AuthenticateUseCase,
            register_parcel_forwarding_1.RegisterParcelForwardingUseCase,
            fetch_recent_check_ins_1.FetchRecentCheckInsUseCase,
            upload_and_create_attachment_1.UploadAndCreateAttachmentUseCase,
            delete_check_in_1.DeleteCheckInUseCase,
            get_check_in_1.GetCheckInUseCase,
            edit_check_in_1.EditCheckInUseCase,
            fetch_recent_check_ins_details_1.FetchRecentCheckInsDetailsUseCase,
            fetch_recent_packages_1.FetchRecentPackagesUseCase,
            get_package_1.GetPackageUseCase,
            get_package_check_ins_details_1.GetPackageCheckInsDetailsUseCase,
            get_customer_by_hub_id_1.GetCustomerByHubIdUseCase,
            fetch_customers_by_name_1.FetchCustomersByNameUseCase,
            check_in_details_presenter_1.CheckInDetailsPresenter,
        ],
    })
], ParcelForwardingModule);
//# sourceMappingURL=parcel-forwarding.module.js.map