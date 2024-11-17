import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  Query,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipe/zod-validation-pipe'
import { z } from 'zod'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { CheckInPresenter } from '../../presenters/check-in-presenter'
import { FilterCheckInsUseCase } from '@/domain/parcel-forwarding/application/use-cases/filter-check-ins'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const filterCheckInBodySchema = z.object({
  customerName: z.string().optional(),
  hubId: z.number().optional(),
  status: z.number().optional(),
  startDate: z
    .string()
    .optional()
    .transform((str) => (str ? new Date(str) : undefined)),
  endDate: z
    .string()
    .optional()
    .transform((str) => (str ? new Date(str) : undefined)),
})

const bodyValidationPipe = new ZodValidationPipe(filterCheckInBodySchema)

type FilterCheckInBodySchema = z.infer<typeof filterCheckInBodySchema>

@Controller('/filter-check-ins')
export class FilterCheckInsController {
  constructor(private FilterCheckIns: FilterCheckInsUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Body(bodyValidationPipe) body: FilterCheckInBodySchema,
  ) {
    const userId = user.sub

    const result = await this.FilterCheckIns.execute({
      parcelForwardingId: userId,
      customerName: body.customerName,
      hubId: body.hubId,
      checkInStatus: body.status,
      startDate: body.startDate,
      endDate: body.endDate,
      page,
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

    const checkInsPreview = result.value.checkInsPreview.map(
      CheckInPresenter.toHTTP,
    )

    return {
      checkInsPreview,
    }
  }
}
