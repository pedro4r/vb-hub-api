import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
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
  checkInStatus: z.number().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(filterCheckInBodySchema)

type FilterCheckInBodySchema = z.infer<typeof filterCheckInBodySchema>

@Controller('/filter-check-ins')
export class FilterCheckInsController {
  constructor(private FilterCheckIns: FilterCheckInsUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Body(bodyValidationPipe) body: FilterCheckInBodySchema,
  ) {
    const userId = user.sub

    console.log(userId)
    const result = await this.FilterCheckIns.execute({
      parcelForwardingId: userId,
      customerName: body.customerName,
      hubId: body.hubId,
      checkInStatus: body.checkInStatus,
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
