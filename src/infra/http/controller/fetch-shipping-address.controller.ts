import {
  BadRequestException,
  ConflictException,
  Controller,
  Get,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { FetchShippingAddressUseCase } from '@/domain/customer/application/use-cases/fetch-shipping-address'
import { ShippingAddressPresenter } from '../presenters/shipping-address-presenter'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

@Controller('/shipping-address')
export class FetchShippingAddressController {
  constructor(
    private fetchShippingAddressUseCase: FetchShippingAddressUseCase,
  ) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const userId = user.sub

    const result = await this.fetchShippingAddressUseCase.execute({
      customerId: userId,
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
    const shippingAddresses = result.value.shippingAddresses

    return {
      shippingAddresses: shippingAddresses.map(ShippingAddressPresenter.toHTTP),
    }
  }
}
