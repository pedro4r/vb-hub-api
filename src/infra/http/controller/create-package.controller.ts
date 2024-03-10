import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipe/zod-validation-pipe'
import { z } from 'zod'
import { CheckInUseCase } from '@/domain/parcel-forwarding/application/use-cases/check-in'
import { CheckInStatus } from '@/domain/parcel-forwarding/enterprise/entities/check-in'

const createCheckInBodySchema = z.object({
  shippingAddressId: z.string(),
  hasBattery: z.boolean(),
  checkInsId: z.array(z.string().uuid()),
})

const bodyValidationPipe = new ZodValidationPipe(createCheckInBodySchema)

type CreateCheckInBodySchema = z.infer<typeof createCheckInBodySchema>

@Controller('/check-in')
export class CreateCheckInController {
  constructor(private checkInUseCase: CheckInUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateCheckInBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { customerId, details, weight, status } = body
    const userId = user.sub

    const result = await this.checkInUseCase.execute({
      customerId,
      details,
      weight,
      status,
      parcelForwardingId: userId,
      attachmentsIds: [],
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
