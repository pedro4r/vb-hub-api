import {
  BadRequestException,
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
import { CheckInDetailsPresenter } from '../../presenters/check-in-details-presenter'
import { FetchRecentCheckInsDetailsUseCase } from '@/domain/parcel-forwarding/application/use-cases/fetch-recent-check-ins-details'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/check-ins-details')
export class FetchRecentCheckInsDetailsController {
  constructor(
    private fetchRecentCheckInsDetailsUseCase: FetchRecentCheckInsDetailsUseCase,
    private checkInDetailsPresenter: CheckInDetailsPresenter,
  ) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const userId = user.sub
    const result = await this.fetchRecentCheckInsDetailsUseCase.execute({
      parcelForwardingId: userId,
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

    const checkInsDetails = result.value.checkInsDetails.map((checkInDetails) =>
      this.checkInDetailsPresenter.toHTTP(checkInDetails),
    )

    return {
      checkInsDetails,
    }
  }
}
