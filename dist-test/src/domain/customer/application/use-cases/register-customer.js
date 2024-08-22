"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterCustomerUseCase = void 0;
const either_1 = require("../../../../core/either");
const user_already_exists_error_1 = require("../../../../core/errors/errors/user-already-exists-error");
const customer_1 = require("../../enterprise/entities/customer");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
class RegisterCustomerUseCase {
    customersRepository;
    parcelForwardingsRepository;
    hashGenerator;
    constructor(customersRepository, parcelForwardingsRepository, hashGenerator) {
        this.customersRepository = customersRepository;
        this.parcelForwardingsRepository = parcelForwardingsRepository;
        this.hashGenerator = hashGenerator;
    }
    async handleHubId(parcelForwardingId) {
        const totalOfParcelForwardingCustomers = await this.customersRepository.countParcelForwardingCustomers(parcelForwardingId);
        const hubId = totalOfParcelForwardingCustomers + 1;
        const parcelForwarding = await this.parcelForwardingsRepository.findById(parcelForwardingId);
        if (!parcelForwarding) {
            throw new Error('Parcel forwarding not found');
        }
        return hubId;
    }
    async execute({ parcelForwardingId, firstName, lastName, email, password, }) {
        const customerWithSameEmail = await this.customersRepository.findByEmail(email);
        if (customerWithSameEmail) {
            return (0, either_1.left)(new user_already_exists_error_1.UserAlreadyExistsError(email));
        }
        const hashedPassword = await this.hashGenerator.hash(password);
        const customer = customer_1.Customer.create({
            parcelForwardingId: new unique_entity_id_1.UniqueEntityID(parcelForwardingId),
            hubId: await this.handleHubId(parcelForwardingId),
            firstName,
            lastName,
            email,
            password: hashedPassword,
            createdAt: new Date(),
        });
        await this.customersRepository.create(customer);
        return (0, either_1.right)({
            customer,
        });
    }
}
exports.RegisterCustomerUseCase = RegisterCustomerUseCase;
//# sourceMappingURL=register-customer.js.map