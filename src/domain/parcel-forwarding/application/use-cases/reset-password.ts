import { Either, left, right } from '@/core/either'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ParcelForwardingsRepository } from '../repositories/parcel-forwardings-repository'
import { HashGenerator } from '@/core/cryptography/hash-generator'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { PasswordValidator } from '@/core/utils/password-validator'

interface ResetParcelForwardingPasswordRequest {
  email: string
  newPassword: string
}

type ResetParcelForwardingPasswordResponse = Either<
  WrongCredentialsError,
  {
    success: boolean
  }
>
@Injectable()
export class ResetParcelForwardingPasswordUseCase {
  constructor(
    private parcelforwardingsRepository: ParcelForwardingsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    email,
    newPassword,
  }: ResetParcelForwardingPasswordRequest): Promise<ResetParcelForwardingPasswordResponse> {
    if (!PasswordValidator.validate(newPassword)) {
      return left(
        new WrongCredentialsError(PasswordValidator.getErrorMessage()),
      )
    }

    const hashedPassword = await this.hashGenerator.hash(newPassword)
    try {
      await this.parcelforwardingsRepository.updatePassword({
        email,
        newPassword: hashedPassword,
      })
      return right({ success: true })
    } catch (error) {
      if (error instanceof Error) {
        return left(new WrongCredentialsError(error.message))
      } else {
        return left(new BadRequestException('An unknown error occurred'))
      }
    }
  }
}
