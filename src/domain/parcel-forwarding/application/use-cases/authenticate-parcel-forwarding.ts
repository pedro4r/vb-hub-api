import { Encrypter } from '@/core/cryptography/encrypter'
import { HashComparer } from '@/core/cryptography/hash-compare'
import { Either, left, right } from '@/core/either'
import { ParcelForwardingsRepository } from '../repositories/parcel-forwardings-repository'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface AuthenticateParcelForwardingUseCaseRequest {
  email: string
  password: string
}

type AuthenticateParcelForwardingUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

export class AuthenticateParcelForwardingUseCase {
  constructor(
    private parcelforwardingsRepository: ParcelForwardingsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateParcelForwardingUseCaseRequest): Promise<AuthenticateParcelForwardingUseCaseResponse> {
    const parcelforwarding =
      await this.parcelforwardingsRepository.findByEmail(email)

    if (!parcelforwarding) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      parcelforwarding.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: parcelforwarding.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
