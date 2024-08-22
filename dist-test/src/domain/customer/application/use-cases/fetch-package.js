"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchPackageUseCase = void 0;
const either_1 = require("../../../../core/either");
const not_allowed_error_1 = require("../../../../core/errors/errors/not-allowed-error");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
class FetchPackageUseCase {
    packageRepository;
    constructor(packageRepository) {
        this.packageRepository = packageRepository;
    }
    async execute({ customerId, }) {
        const packages = await this.packageRepository.findManyByCustomerId(customerId);
        if (!packages) {
            return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError());
        }
        if (customerId !== packages[0]?.customerId.toString()) {
            return (0, either_1.left)(new not_allowed_error_1.NotAllowedError());
        }
        return (0, either_1.right)({
            packages,
        });
    }
}
exports.FetchPackageUseCase = FetchPackageUseCase;
//# sourceMappingURL=fetch-package.js.map