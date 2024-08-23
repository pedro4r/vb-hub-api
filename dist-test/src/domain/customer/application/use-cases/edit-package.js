"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditPackagesUseCase = void 0;
const either_1 = require("../../../../core/either");
const not_allowed_error_1 = require("../../../../core/errors/errors/not-allowed-error");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const customs_declaration_item_1 = require("../../enterprise/entities/customs-declaration-item");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const package_check_in_1 = require("../../enterprise/entities/package-check-in");
class EditPackagesUseCase {
    packageRepository;
    declarationModelItemsRepository;
    packageShippingAddressRepository;
    constructor(packageRepository, declarationModelItemsRepository, packageShippingAddressRepository) {
        this.packageRepository = packageRepository;
        this.declarationModelItemsRepository = declarationModelItemsRepository;
        this.packageShippingAddressRepository = packageShippingAddressRepository;
    }
    async execute({ packageId, customerId, shippingAddressId, checkInsIds, declarationModelId, hasBattery, }) {
        const pkg = await this.packageRepository.findById(packageId);
        if (!pkg) {
            return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError());
        }
        if (pkg.customerId.toString() !== customerId) {
            return (0, either_1.left)(new not_allowed_error_1.NotAllowedError());
        }
        pkg.hasBattery = hasBattery;
        await this.packageShippingAddressRepository.delete(pkg.shippingAddressId.toString());
        await this.packageShippingAddressRepository.create(shippingAddressId);
        pkg.shippingAddressId = new unique_entity_id_1.UniqueEntityID(shippingAddressId);
        const packageCheckIns = checkInsIds.map((checkInId) => {
            return package_check_in_1.PackageCheckIn.create({
                checkInId: new unique_entity_id_1.UniqueEntityID(checkInId),
                packageId: pkg.id,
            });
        });
        pkg.checkIns.update(packageCheckIns);
        if (declarationModelId) {
            const declarationModelItems = await this.declarationModelItemsRepository.findManyByDeclarationModelId(declarationModelId);
            if (!declarationModelItems) {
                return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError());
            }
            const customsDeclarationItems = declarationModelItems.map((declarationModelItem) => {
                return customs_declaration_item_1.CustomsDeclarationItem.create({
                    packageId: pkg.id,
                    description: declarationModelItem.description,
                    value: declarationModelItem.value,
                    quantity: declarationModelItem.quantity,
                }, new unique_entity_id_1.UniqueEntityID(declarationModelItem.id.toString()));
            });
            pkg.customsDeclarationList.update(customsDeclarationItems);
        }
        await this.packageRepository.save(pkg);
        return (0, either_1.right)({
            package: pkg,
        });
    }
}
exports.EditPackagesUseCase = EditPackagesUseCase;
//# sourceMappingURL=edit-package.js.map