import { Encrypter } from '@/core/cryptography/encrypter'
import { HashComparer } from '@/core/cryptography/hash-compare'
import { Either, left, right } from '@/core/either'
import { ParcelForwardingsRepository } from '../repositories/parcel-forwardings-repository'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { Injectable } from '@nestjs/common'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

type AuthenticateUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateUseCase {
  constructor(
    private parcelforwardingsRepository: ParcelForwardingsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
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
