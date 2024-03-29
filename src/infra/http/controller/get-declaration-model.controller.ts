import {
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { GetDeclarationModelUseCase } from '@/domain/customer/application/use-cases/get-declaration-model'
import { DeclarationModelPresenter } from '../presenters/declaration-model-presenter'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

@Controller('/declaration-model/:id')
export class GetDeclarationModelController {
  constructor(private getDeclarationModelUseCase: GetDeclarationModelUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') declarationModelId: string,
  ) {
    const userId = user.sub

    const result = await this.getDeclarationModelUseCase.execute({
      customerId: userId,
      declarationModelId,
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

    const declarationModel = result.value.declarationModel

    return {
      declarationModel: DeclarationModelPresenter.toHTTP(declarationModel),
    }
  }
}
