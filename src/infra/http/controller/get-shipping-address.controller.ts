import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ShippingAddressPresenter } from '../presenters/shipping-address-presenter'
import { GetShippingAddressUseCase } from '@/domain/customer/application/use-cases/get-shipping-address'

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
      throw new BadRequestException()
    }

    const shippingAddress = result.value.shippingAddress

    return {
      shippingAddress: ShippingAddressPresenter.toHTTP(shippingAddress),
    }
  }
}
