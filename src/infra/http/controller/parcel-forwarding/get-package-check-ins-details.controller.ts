import {
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ZodValidationPipe } from '../../pipe/zod-validation-pipe'
import { z } from 'zod'
import { GetPackageCheckInsDetailsUseCase } from '@/domain/parcel-forwarding/application/use-cases/get-package-check-ins-details'
import { CheckInDetailsPresenter } from '../../presenters/check-in-details-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/package-check-ins/:id')
export class GetPackageCheckInsDetailsController {
  constructor(
    private getPackageCheckInsDetailsUseCase: GetPackageCheckInsDetailsUseCase,
  ) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') packageId: string,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const userId = user.sub

    const result = await this.getPackageCheckInsDetailsUseCase.execute({
      parcelForwardingId: userId,
      packageId,
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

    const checkInsDetails = result.value.checkInsDetails.map(
      (checkInDetails) => {
        return CheckInDetailsPresenter.toHTTP(checkInDetails)
      },
    )

    return {
      checkInsDetails,
    }
  }
}
