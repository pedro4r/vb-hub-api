import { Either, left, right } from '@/core/either'
import { BadRequestException, Injectable } from '@nestjs/common'
import { Token } from '@/core/cryptography/token'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface VerifyResetPasswordTokenUseCaseRequest {
  token: string
}

type VerifyResetPasswordTokenUseCaseResponse = Either<
  WrongCredentialsError,
  {
    email: string
  }
>

@Injectable()
export class VerifyResetPasswordTokenUseCase {
  constructor(private token: Token) {}

  async execute({
    token,
  }: VerifyResetPasswordTokenUseCaseRequest): Promise<VerifyResetPasswordTokenUseCaseResponse> {
    try {
      const email = await this.token.decodeToken(token)
      return right({ email })
    } catch (error) {
      if (error instanceof Error) {
        return left(new WrongCredentialsError(error.message))
      } else {
        return left(new BadRequestException('An unknown error occurred'))
      }
    }
  }
}
