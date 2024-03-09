import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipe/zod-validation-pipe'
import { z } from 'zod'
import { CheckInUseCase } from '@/domain/parcel-forwarding/application/use-cases/check-in'

const createCheckInBodySchema = z.object({
  customerId: z.string(),
  details: z.string(),
  weight: z
    .string()
    .optional()
    .default('0')
    .transform(Number)
    .pipe(z.number().min(0)),
})

const bodyValidationPipe = new ZodValidationPipe(createCheckInBodySchema)

type CreateCheckInBodySchema = z.infer<typeof createCheckInBodySchema>

@Controller('/check-in')
@UseGuards(JwtAuthGuard)
export class CreateCheckInController {
  constructor(private checkInUseCase: CheckInUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateCheckInBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { customerId, details, weight } = body
    const userId = user.sub

    await this.checkInUseCase.execute({
      customerId,
      details,
      weight,
      parcelForwardingId: userId,
      attachmentsIds: [],
    })
  }
}
