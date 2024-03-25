import { BadRequestException, Controller, Get } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { FetchShippingAddressUseCase } from '@/domain/customer/application/use-cases/fetch-shipping-address'
import { ShippingAddressPresenter } from '../presenters/shipping-address-presenter'

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
      throw new BadRequestException()
    }

    const shippingAddresses = result.value.shippingAddresses

    return {
      shippingAddresses: shippingAddresses.map(ShippingAddressPresenter.toHTTP),
    }
  }
}
