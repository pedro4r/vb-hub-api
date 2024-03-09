import { Either, left, right } from '@/core/either'
import { UserAlreadyExistsError } from '@/core/errors/errors/user-already-exists-error'
import { Customer } from '../../enterprise/entities/customer'
import { CustomerRepository } from '../repositories/customer-repository'
import { HashGenerator } from '@/core/cryptography/hash-generator'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ParcelForwardingsRepository } from '@/domain/parcel-forwarding/application/repositories/parcel-forwardings-repository'
import { HubId } from '../../enterprise/entities/value-objects/hub-id'

interface RegisterCustomerUseCaseRequest {
  parcelForwardingId: string
  name: string
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

  private async prepareHubId(parcelForwardingId: string): Promise<HubId> {
    let creatingCustomerCode =
      await this.customersRepository.countParcelForwardingCustomers(
        parcelForwardingId,
      )
    creatingCustomerCode ? creatingCustomerCode++ : (creatingCustomerCode = 1)

    const parcelForwarding =
      await this.parcelForwardingsRepository.findById(parcelForwardingId)

    if (!parcelForwarding) {
      throw new Error('Parcel forwarding not found')
    }

    return HubId.create({
      parcelForwadingInitials: parcelForwarding.initials,
      customerCode: creatingCustomerCode,
    })
  }

  async execute({
    parcelForwardingId,
    name,
    email,
    password,
  }: RegisterCustomerUseCaseRequest): Promise<RegisterCustomerUseCaseResponse> {
    const customerWithSameEmail =
      await this.customersRepository.findByEmail(email)

    if (customerWithSameEmail) {
      return left(new UserAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    this.prepareHubId(parcelForwardingId)

    const customer = Customer.create({
      parcelForwardingId: new UniqueEntityID(parcelForwardingId),
      hubId: await this.prepareHubId(parcelForwardingId),
      name,
      email,
      password: hashedPassword,
    })

    await this.customersRepository.create(customer)

    return right({
      customer,
    })
  }
}
