import {
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  Param,
} from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { GetCustomerByHubIdUseCase } from '@/domain/parcel-forwarding/application/use-cases/get-customer-by-hub-id'
import { CustomerPreviewPresenter } from '../../presenters/customer-preview-presenter'
import { Public } from '@/infra/auth/public'

@Controller('/customer/:id')
@Public()
export class GetCustomerByHubIdController {
  constructor(private getCustomerByHubIdUseCase: GetCustomerByHubIdUseCase) {}

  @Get()
  async handle(@Param('id') hubId: string) {
    const userId = '3009842e-0800-4590-8be9-6378c941e8db'

    const result = await this.getCustomerByHubIdUseCase.execute({
      parcelForwardingId: userId,
      hubId: Number(hubId),
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

    const customerPreview = CustomerPreviewPresenter.toHTTP(
      result.value.customerPreview,
    )

    return {
      customerPreview,
    }
  }
}
