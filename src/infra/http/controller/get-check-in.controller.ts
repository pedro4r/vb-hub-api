import {
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { GetCheckInUseCase } from '@/domain/parcel-forwarding/application/use-cases/get-check-in'

@Controller('/check-in/:id')
export class GetCheckInController {
  constructor(private getCheckInUseCase: GetCheckInUseCase) {}

  @Get()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') checkInId: string,
  ) {
    const userId = user.sub

    const result = await this.getCheckInUseCase.execute({
      parcelForwardingId: userId,
      checkInId,
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
