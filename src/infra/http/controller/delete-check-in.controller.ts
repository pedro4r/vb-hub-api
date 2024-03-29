import {
  BadRequestException,
  ConflictException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { DeleteCheckInUseCase } from '@/domain/parcel-forwarding/application/use-cases/delete-check-in'

@Controller('/check-in/:id')
export class DeleteCheckInController {
  constructor(private deleteCheckInUseCase: DeleteCheckInUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') checkInId: string,
  ) {
    const userId = user.sub

    const result = await this.deleteCheckInUseCase.execute({
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
