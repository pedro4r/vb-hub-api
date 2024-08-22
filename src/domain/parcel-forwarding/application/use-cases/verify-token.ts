// src/domain/auth/application/use-cases/verify-token.use-case.ts
import { AuthService } from '@/core/cryptography/auth-service-repository'
import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface VerifyTokenUseCaseRequest {
  token: string
}

type VerifyTokenUseCaseReponse = Either<
  WrongCredentialsError,
  {
    status: string
  }
>

@Injectable()
export class VerifyTokenUseCase {
  constructor(private authService: AuthService) {}

  async execute({
    token,
  }: VerifyTokenUseCaseRequest): Promise<VerifyTokenUseCaseReponse> {
    const isValid = await this.authService.verifyToken(token)
    if (isValid) {
      return right({ status: 'authenticated' })
    } else {
      return left(new WrongCredentialsError())
    }
  }
}
