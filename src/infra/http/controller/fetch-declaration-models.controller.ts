import { BadRequestException, Controller, Get } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { FetchDeclarationModelsUseCase } from '@/domain/customer/application/use-cases/fetch-declaration-model'
import { DeclarationModelPresenter } from '../presenters/declaration-model-presenter'

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
      throw new BadRequestException()
    }

    const declarationModels = result.value.declarationModels

    return {
      declarationModels: declarationModels.map(
        DeclarationModelPresenter.toHTTP,
      ),
    }
  }
}
