import { Either, left, right } from '@/core/either'
import { UserAlreadyExistsError } from '@/core/errors/errors/user-already-exists-error'
import { Customer } from '../../enterprise/entities/customer'
import { CustomerRepository } from '../repositories/customer-repository'
import { HashGenerator } from '@/core/cryptography/hash-generator'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ParcelForwardingsRepository } from '@/domain/parcel-forwarding/application/repositories/parcel-forwardings-repository'

interface RegisterCustomerUseCaseRequest {
  parcelForwardingId: string
  firstName: string
  lastName: string
  email: string
  password: string
}

type RegisterCustomerUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    customer: Customer
  }
>

export class RegisterCustomerUseCase {
  constructor(
    private customersRepository: CustomerRepository,
    private parcelForwardingsRepository: ParcelForwardingsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  private async handleHubId(parcelForwardingId: string): Promise<number> {
    const totalOfParcelForwardingCustomers =
      await this.customersRepository.countParcelForwardingCustomers(
        parcelForwardingId,
      )

    const hubId = totalOfParcelForwardingCustomers + 1

    const parcelForwarding =
      await this.parcelForwardingsRepository.findById(parcelForwardingId)

    if (!parcelForwarding) {
      throw new Error('Parcel forwarding not found')
    }

    return hubId
  }

  async execute({
    parcelForwardingId,
    firstName,
    lastName,
    email,
    password,
  }: RegisterCustomerUseCaseRequest): Promise<RegisterCustomerUseCaseResponse> {
    const customerWithSameEmail =
      await this.customersRepository.findByEmail(email)

    if (customerWithSameEmail) {
      return left(new UserAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const customer = Customer.create({
      parcelForwardingId: new UniqueEntityID(parcelForwardingId),
      hubId: await this.handleHubId(parcelForwardingId),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    })

    await this.customersRepository.create(customer)

    return right({
      customer,
    })
  }
}
