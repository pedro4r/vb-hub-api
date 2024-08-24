import { Either, left, right } from '@/core/either'
import { ParcelForwardingsRepository } from '../repositories/parcel-forwardings-repository'
import { Injectable } from '@nestjs/common'
import { InvalidEmailError } from './errors/invalid-email-error'
import { Token } from '@/core/cryptography/token'

interface CreatePasswordResetUrlUseCaseRequest {
  email: string
}

type CreatePasswordResetUrlUseCaseResponse = Either<
  InvalidEmailError,
  {
    resetPasswordTokenUrl: string
  }
>
@Injectable()
export class CreatePasswordResetUrlUseCase {
  constructor(
    private parcelforwardingsRepository: ParcelForwardingsRepository,
    private token: Token,
  ) {}

  async execute({
    email,
  }: CreatePasswordResetUrlUseCaseRequest): Promise<CreatePasswordResetUrlUseCaseResponse> {
    const parcelforwardingWithSameEmail =
      await this.parcelforwardingsRepository.findByEmail(email)

    if (!parcelforwardingWithSameEmail) {
      return left(new InvalidEmailError(email))
    }

    const resetPasswordTokenUrl = await this.token.resetPasswordTokenUrl(email)

    return right({
      resetPasswordTokenUrl,
    })
  }
}
