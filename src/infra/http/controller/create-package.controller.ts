import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipe/zod-validation-pipe'
import { z } from 'zod'
import { CreatePackageUseCase } from '@/domain/customer/application/use-cases/create-package'

const createPackageBodySchema = z.object({
  shippingAddressId: z.string(),
  hasBattery: z.boolean(),
  checkInsId: z.array(z.string().uuid()),
  declarationModelItems: z.array(z.string().uuid()),
})

const bodyValidationPipe = new ZodValidationPipe(createPackageBodySchema)

type CreatePackageBodySchema = z.infer<typeof createPackageBodySchema>

@Controller('/package')
export class CreatePackageController {
  constructor(private createPackageUseCase: CreatePackageUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreatePackageBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { shippingAddressId, hasBattery, checkInsId, declarationModelItems } =
      body
    const userId = user.sub

    const result = await this.createPackageUseCase.execute({
      shippingAddressId,
      hasBattery,
      checkInsId,
      declarationModelItems,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
