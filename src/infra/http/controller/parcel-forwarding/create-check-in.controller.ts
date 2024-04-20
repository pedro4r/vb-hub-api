import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipe/zod-validation-pipe'
import { z } from 'zod'
import { CheckInUseCase } from '@/domain/parcel-forwarding/application/use-cases/check-in'

const createCheckInBodySchema = z.object({
  customerId: z.string().uuid(),
  details: z.string().optional().default(''),
  weight: z.number().max(453139).optional().default(0), // Max. 999 lbs (453139 grams)
  attachmentsIds: z.array(z.string().uuid()),
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
    const { customerId, details, weight, attachmentsIds } = body

    const userId = user.sub

    // Imprime o payload do token JWT no console

    const result = await this.checkInUseCase.execute({
      customerId,
      details,
      weight,
      status: 1,
      parcelForwardingId: userId,
      attachmentsIds,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
