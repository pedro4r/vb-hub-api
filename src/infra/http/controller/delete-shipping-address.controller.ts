import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteShippingAddressUseCase } from '@/domain/customer/application/use-cases/delete-shipping-address'

@Controller('/shipping-address/:id')
export class DeleteShippingAddressController {
  constructor(private deleteShippingAddress: DeleteShippingAddressUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') shippingAddressId: string,
  ) {
    const userId = user.sub

    const result = await this.deleteShippingAddress.execute({
      customerId: userId,
      shippingAddressId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
