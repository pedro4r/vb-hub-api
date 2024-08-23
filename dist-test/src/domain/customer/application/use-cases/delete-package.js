"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePackageUseCase = void 0;
const either_1 = require("../../../../core/either");
const not_allowed_error_1 = require("../../../../core/errors/errors/not-allowed-error");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
class DeletePackageUseCase {
    packageRepository;
    constructor(packageRepository) {
        this.packageRepository = packageRepository;
    }
    async execute({ customerId, packageId, }) {
        const pkg = await this.packageRepository.findById(packageId);
        if (!pkg) {
            return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError());
        }
        if (customerId !== pkg.customerId.toString()) {
            return (0, either_1.left)(new not_allowed_error_1.NotAllowedError());
        }
        await this.packageRepository.delete(pkg);
        return (0, either_1.right)(null);
    }
}
exports.DeletePackageUseCase = DeletePackageUseCase;
//# sourceMappingURL=delete-package.js.map