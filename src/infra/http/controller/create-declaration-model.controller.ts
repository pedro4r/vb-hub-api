import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipe/zod-validation-pipe'
import { z } from 'zod'
import { CreateDeclarationModelUseCase } from '@/domain/customer/application/use-cases/create-declaration-model'

const CreateDeclarationModelBodySchema = z.object({
  title: z.string(),
  declarationModelItems: z.array(
    z.object({
      description: z.string(),
      value: z.number(),
      quantity: z.number(),
    }),
  ),
})

const bodyValidationPipe = new ZodValidationPipe(
  CreateDeclarationModelBodySchema,
)

type CreateDeclarationModelBodySchema = z.infer<
  typeof CreateDeclarationModelBodySchema
>

@Controller('/declaration-model')
export class CreateDeclarationModelController {
  constructor(
    private createDeclarationModelUseCase: CreateDeclarationModelUseCase,
  ) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateDeclarationModelBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, declarationModelItems } = body
    const userId = user.sub

    const result = await this.createDeclarationModelUseCase.execute({
      customerId: userId,
      title,
      declarationModelItems,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
