import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteDeclarationModelUseCase } from '@/domain/customer/application/use-cases/delete-declaration-model'

@Controller('/declaration-model/:id')
export class DeleteDeclarationModelController {
  constructor(private deleteDeclarationModel: DeleteDeclarationModelUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') declarationModelId: string,
  ) {
    const userId = user.sub

    const result = await this.deleteDeclarationModel.execute({
      customerId: userId,
      declarationModelId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
