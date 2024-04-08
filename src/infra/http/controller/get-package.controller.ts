import {
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { GetPackageUseCase } from '@/domain/parcel-forwarding/application/use-cases/get-package'
import { PackagePresenter } from '../presenters/package-presenter'

@Controller('/package/:id')
export class GetPackageController {
  constructor(private getPackageUseCase: GetPackageUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') packageId: string,
  ) {
    const userId = user.sub

    const resultPackageDetails = await this.getPackageUseCase.execute({
      parcelForwardingId: userId,
      packageId,
    })

    if (resultPackageDetails.isLeft()) {
      const error = resultPackageDetails.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new ConflictException(error.message)
        case NotAllowedError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const packageDetails = PackagePresenter.toHTTP(
      resultPackageDetails.value.packageDetails,
    )

    return {
      packageDetails,
    }
  }
}
