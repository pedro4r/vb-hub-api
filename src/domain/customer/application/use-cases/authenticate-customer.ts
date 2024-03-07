import { Either, left, right } from '@/core/either'
import { WrongCredentialsError } from '@/domain/parcel-forwarding/application/use-cases/errors/wrong-credentials-error'
import { CustomerRepository } from '../repositories/customer-repository'
import { HashComparer } from '@/core/cryptography/hash-compare'
import { Encrypter } from '@/core/cryptography/encrypter'

interface AuthenticateCustomerUseCaseRequest {
  email: string
  password: string
}

type AuthenticateCustomerUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

export class AuthenticateCustomerUseCase {
  constructor(
    private customersRepository: CustomerRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateCustomerUseCaseRequest): Promise<AuthenticateCustomerUseCaseResponse> {
    const customer = await this.customersRepository.findByEmail(email)

    if (!customer) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      customer.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: customer.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
