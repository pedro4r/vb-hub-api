import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipe/zod-validation-pipe'
import { z } from 'zod'
import { CreatePackageUseCase } from '@/domain/customer/application/use-cases/create-package'

const createPackageBodySchema = z.object({
  parcelForwardingId: z.string(),
  shippingAddressId: z.string(),
  checkInsIds: z.array(z.string().uuid()),
  declarationModelId: z.string().optional(),
  hasBattery: z.boolean(),
  taxId: z.string(),
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
    const {
      parcelForwardingId,
      shippingAddressId,
      checkInsIds,
      declarationModelId,
      taxId,
      hasBattery,
    } = body
    const userId = user.sub

    const result = await this.createPackageUseCase.execute({
      customerId: userId,
      parcelForwardingId,
      shippingAddressId,
      checkInsIds,
      declarationModelId,
      taxId,
      hasBattery,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
