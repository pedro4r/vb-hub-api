import {
  BadRequestException,
  ConflictException,
  Controller,
  Get,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { FetchDeclarationModelsUseCase } from '@/domain/customer/application/use-cases/fetch-declaration-model'
import { DeclarationModelPresenter } from '../../presenters/declaration-model-presenter'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

@Controller('/declaration-model')
export class FetchDeclarationModelsController {
  constructor(
    private fetchDeclarationModelsUseCase: FetchDeclarationModelsUseCase,
  ) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const userId = user.sub

    const result = await this.fetchDeclarationModelsUseCase.execute({
      customerId: userId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new ConflictException(error.message)
        case NotAllowedError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const declarationModels = result.value.declarationModels

    return {
      declarationModels: declarationModels.map(
        DeclarationModelPresenter.toHTTP,
      ),
    }
  }
}
