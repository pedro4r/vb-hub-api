"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticateCustomerUseCase = void 0;
const either_1 = require("../../../../core/either");
const wrong_credentials_error_1 = require("../../../parcel-forwarding/application/use-cases/errors/wrong-credentials-error");
class AuthenticateCustomerUseCase {
    customersRepository;
    hashComparer;
    encrypter;
    constructor(customersRepository, hashComparer, encrypter) {
        this.customersRepository = customersRepository;
        this.hashComparer = hashComparer;
        this.encrypter = encrypter;
    }
    async execute({ email, password, }) {
        const customer = await this.customersRepository.findByEmail(email);
        if (!customer) {
            return (0, either_1.left)(new wrong_credentials_error_1.WrongCredentialsError());
        }
        const isPasswordValid = await this.hashComparer.compare(password, customer.password);
        if (!isPasswordValid) {
            return (0, either_1.left)(new wrong_credentials_error_1.WrongCredentialsError());
        }
        const accessToken = await this.encrypter.encrypt({
            sub: customer.id.toString(),
        });
        return (0, either_1.right)({
            accessToken,
        });
    }
}
exports.AuthenticateCustomerUseCase = AuthenticateCustomerUseCase;
//# sourceMappingURL=authenticate-customer.js.map