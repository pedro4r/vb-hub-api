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
import { ZodValidationPipe } from '../../pipe/zod-validation-pipe'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { EditCheckInUseCase } from '@/domain/parcel-forwarding/application/use-cases/edit-check-in'

const editCheckInBodySchema = z.object({
  customerId: z.string().uuid(),
  details: z.string().optional().default(''),
  status: z.string().transform(Number).pipe(z.number().min(1)),
  weight: z
    .string()
    .optional()
    .default('0')
    .transform(Number)
    .pipe(z.number().min(0)),
  attachmentsIds: z.array(z.string().uuid()),
})

const bodyValidationPipe = new ZodValidationPipe(editCheckInBodySchema)

type EditCheckInBodySchema = z.infer<typeof editCheckInBodySchema>

@Controller('/check-in/:id')
export class EditCheckInController {
  constructor(private editCheckInUseCase: EditCheckInUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditCheckInBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') checkInId: string,
  ) {
    const { customerId, status, details, weight, attachmentsIds } = body
    const userId = user.sub

    const result = await this.editCheckInUseCase.execute({
      checkInId,
      parcelForwardingId: userId,
      customerId,
      details,
      weight,
      status,
      attachmentsIds,
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
