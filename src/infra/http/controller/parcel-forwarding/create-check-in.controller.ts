import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipe/zod-validation-pipe'
import { z } from 'zod'
import { CheckInUseCase } from '@/domain/parcel-forwarding/application/use-cases/check-in'
import { SendNewCheckInEmailUseCase } from '@/domain/parcel-forwarding/application/use-cases/send-new-check-in-email'
import { EnvService } from '@/infra/env/env.service'

const createCheckInBodySchema = z.object({
  customerId: z.string().uuid(),
  details: z.string().max(100).optional().default(''),
  weight: z.number().max(453139).optional().default(0), // Max. 999 lbs (453139 grams)
  attachmentsIds: z.array(z.string().uuid()),
})

const bodyValidationPipe = new ZodValidationPipe(createCheckInBodySchema)

type CreateCheckInBodySchema = z.infer<typeof createCheckInBodySchema>

@Controller('/check-in')
export class CreateCheckInController {
  constructor(
    private checkInUseCase: CheckInUseCase,
    private sendNewCheckInEmailUseCase: SendNewCheckInEmailUseCase,
    private envService: EnvService,
  ) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateCheckInBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { customerId, details, weight, attachmentsIds } = body

    const parcelForwardingId = user.sub

    const result = await this.checkInUseCase.execute({
      customerId,
      details,
      weight,
      status: 1,
      parcelForwardingId,
      attachmentsIds,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const senderEmail = this.envService.get('SMTP_USER')
    const r2DevURL = this.envService.get('CLOUDFLARE_DEV_URL')

    const response = await this.sendNewCheckInEmailUseCase.execute({
      parcelForwardingId,
      sender: senderEmail,
      customerId,
      checkInDetails: details,
      weight,
      attachmentsIds,
      storageURL: r2DevURL,
    })

    if (response.isLeft()) {
      throw new BadRequestException()
    }
  }
}
