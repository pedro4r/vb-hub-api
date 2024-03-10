import { RegisterParcelForwardingUseCase } from '@/domain/parcel-forwarding/application/use-cases/register-parcel-forwarding'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipe/zod-validation-pipe'
import { AccountAlreadyExistsError } from '@/domain/parcel-forwarding/application/use-cases/errors/account-already-exists-error'
import { Public } from '@/infra/auth/public'

const createAccountBodySchema = z.object({
  name: z.string(),
  initials: z.string().length(3),
  email: z.string().email(),
  password: z.string(),
})

type RegisterParcelForwardingBodySchema = z.infer<
  typeof createAccountBodySchema
>

@Controller('/parcel-forwarding/register')
@Public()
export class RegisterParcelForwardingController {
  constructor(private registerStudent: RegisterParcelForwardingUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: RegisterParcelForwardingBodySchema) {
    const { name, initials, email, password } = body

    const result = await this.registerStudent.execute({
      name,
      initials,
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case AccountAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
