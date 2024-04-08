import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipe/zod-validation-pipe'
import { z } from 'zod'
import { CreateShippingAddressUseCase } from '@/domain/customer/application/use-cases/create-shipping-address'

const createShippingAddressBodySchema = z.object({
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

const bodyValidationPipe = new ZodValidationPipe(
  createShippingAddressBodySchema,
)

type CreateShippingAddressBodySchema = z.infer<
  typeof createShippingAddressBodySchema
>

@Controller('/shipping-address')
export class CreateShippingAddressController {
  constructor(
    private createShippingAddressUseCase: CreateShippingAddressUseCase,
  ) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateShippingAddressBodySchema,
    @CurrentUser() user: UserPayload,
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

    const result = await this.createShippingAddressUseCase.execute({
      customerId: userId,
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
      throw new BadRequestException()
    }
  }
}
