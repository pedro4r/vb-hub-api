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
exports.CreatePackageUseCase = void 0;
const either_1 = require("../../../../core/either");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const package_1 = require("../../enterprise/entities/package");
const package_repository_1 = require("../repositories/package-repository");
const customs_declaration_item_1 = require("../../enterprise/entities/customs-declaration-item");
const customs_declaration_list_1 = require("../../enterprise/entities/customs-declaration-list");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const declaration_model_item_repository_1 = require("../repositories/declaration-model-item-repository");
const package_check_in_1 = require("../../enterprise/entities/package-check-in");
const package_check_ins_list_1 = require("../../enterprise/entities/package-check-ins-list");
const common_1 = require("@nestjs/common");
let CreatePackageUseCase = class CreatePackageUseCase {
    packageRepository;
    declarationModelItemsRepository;
    constructor(packageRepository, declarationModelItemsRepository) {
        this.packageRepository = packageRepository;
        this.declarationModelItemsRepository = declarationModelItemsRepository;
    }
    async execute({ customerId, parcelForwardingId, shippingAddressId, checkInsIds, declarationModelId, hasBattery, }) {
        const pkg = package_1.Package.create({
            customerId: new unique_entity_id_1.UniqueEntityID(customerId),
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID(parcelForwardingId),
            shippingAddressId: new unique_entity_id_1.UniqueEntityID(shippingAddressId),
            hasBattery,
        });
        const packageCheckIns = checkInsIds.map((checkInId) => {
            return package_check_in_1.PackageCheckIn.create({
                checkInId: new unique_entity_id_1.UniqueEntityID(checkInId),
                packageId: pkg.id,
            });
        });
        pkg.checkIns = new package_check_ins_list_1.PackageCheckInsList(packageCheckIns);
        if (declarationModelId) {
            const declarationModelItems = await this.declarationModelItemsRepository.findManyByDeclarationModelId(declarationModelId);
            if (!declarationModelItems) {
                return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError('Declaration Model Items not found'));
            }
            const customsDeclarationItems = declarationModelItems.map((declarationModelItem) => {
                return customs_declaration_item_1.CustomsDeclarationItem.create({
                    packageId: pkg.id,
                    description: declarationModelItem.description,
                    value: declarationModelItem.value,
                    quantity: declarationModelItem.quantity,
                });
            });
            pkg.customsDeclarationList = new customs_declaration_list_1.CustomsDeclarationList(customsDeclarationItems);
        }
        await this.packageRepository.create(pkg);
        return (0, either_1.right)({
            pkg,
        });
    }
};
exports.CreatePackageUseCase = CreatePackageUseCase;
exports.CreatePackageUseCase = CreatePackageUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [package_repository_1.PackageRepository,
        declaration_model_item_repository_1.DeclarationModelItemsRepository])
], CreatePackageUseCase);
//# sourceMappingURL=create-package.js.map