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
import { CustomerPreviewPresenter } from '../../presenters/customer-preview-presenter'
import { FetchCustomersByNameUseCase } from '@/domain/parcel-forwarding/application/use-cases/fetch-customers-by-name'

@Controller('/customers/:name')
export class FetchCustomersByNameController {
  constructor(
    private fetchCustomersByNameUseCase: FetchCustomersByNameUseCase,
  ) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload, @Param('name') name: string) {
    const userId = user.sub

    const result = await this.fetchCustomersByNameUseCase.execute({
      parcelForwardingId: userId,
      name,
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

    const customersPreview = result.value.customersPreview.map((customer) =>
      CustomerPreviewPresenter.toHTTP(customer),
    )

    return {
      customersPreview,
    }
  }
}
