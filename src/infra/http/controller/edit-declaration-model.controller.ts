import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipe/zod-validation-pipe'
import { EditDeclarationModelUseCase } from '@/domain/customer/application/use-cases/edit-declaration-model'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

const editDeclarationModelBodySchema = z.object({
  title: z.string(),
  declarationModelItems: z.array(
    z.object({
      id: z.string(),
      declarationModelId: z.string(),
      description: z.string(),
      value: z.number(),
      quantity: z.number(),
    }),
  ),
})

const bodyValidationPipe = new ZodValidationPipe(editDeclarationModelBodySchema)

type EditDeclarationModelBodySchema = z.infer<
  typeof editDeclarationModelBodySchema
>

@Controller('/declaration-model/:id')
export class EditDeclarationModelController {
  constructor(
    private editDeclarationModelUseCase: EditDeclarationModelUseCase,
  ) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditDeclarationModelBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') declarationModelId: string,
  ) {
    const { title, declarationModelItems } = body
    const userId = user.sub

    const result = await this.editDeclarationModelUseCase.execute({
      customerId: userId,
      declarationModelId,
      title,
      items: declarationModelItems.map((item) => ({
        id: item.id,
        declarationModelId: item.declarationModelId,
        description: item.description,
        value: item.value,
        quantity: item.quantity,
      })),
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
  }
}
