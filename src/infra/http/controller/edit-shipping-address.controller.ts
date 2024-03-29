import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipe/zod-validation-pipe'
import { EditShippingAddressUseCase } from '@/domain/customer/application/use-cases/edit-shipping-address'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

const editShippingAddressBodySchema = z.object({
  recipientName: z.string(),
  taxId: z.string().optional(),
  email: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string(),
  complement: z.string().optional(),
  city: z.string(),
  state: z.string(),
  zipcode: z.string(),
  country: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editShippingAddressBodySchema)

type EditShippingAddressBodySchema = z.infer<
  typeof editShippingAddressBodySchema
>

@Controller('/shipping-address/:id')
export class EditShippingAddressController {
  constructor(private editShippingAddress: EditShippingAddressUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditShippingAddressBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') shippingAddressId: string,
  ) {
    const {
      recipientName,
      taxId,
      email,
      phoneNumber,
      address,
      complement,
      city,
      state,
      zipcode,
      country,
    } = body
    const userId = user.sub

    const result = await this.editShippingAddress.execute({
      customerId: userId,
      shippingAddressId,
      recipientName,
      taxId,
      email,
      phoneNumber,
      address,
      complement,
      city,
      state,
      zipcode,
      country,
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
