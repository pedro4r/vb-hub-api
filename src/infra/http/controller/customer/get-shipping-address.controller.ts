import {
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ShippingAddressPresenter } from '../../presenters/shipping-address-presenter'
import { GetShippingAddressUseCase } from '@/domain/customer/application/use-cases/get-shipping-address'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

@Controller('/shipping-address/:id')
export class GetShippingAddressController {
  constructor(private getShippingAddressUseCase: GetShippingAddressUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') shippingAddressId: string,
  ) {
    const userId = user.sub

    const result = await this.getShippingAddressUseCase.execute({
      customerId: userId,
      shippingAddressId,
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

    const shippingAddress = result.value.shippingAddress

    return {
      shippingAddress: ShippingAddressPresenter.toHTTP(shippingAddress),
    }
  }
}
