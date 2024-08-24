import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  Res,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { Public } from '@/infra/auth/public'
import { Response } from 'express'
import { ZodValidationPipe } from '../../pipe/zod-validation-pipe'
import { CreatePasswordResetUrlUseCase } from '@/domain/parcel-forwarding/application/use-cases/create-password-reset-url'
import { InvalidEmailError } from '@/domain/parcel-forwarding/application/use-cases/errors/invalid-email-error'

const authenticateBodySchema = z.object({
  email: z.string().email(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/reset-password')
@Public()
export class ResetPasswordController {
  constructor(private createPasswordResetUrl: CreatePasswordResetUrlUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema, @Res() res: Response) {
    const { email } = body

    const result = await this.createPasswordResetUrl.execute({
      email,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidEmailError:
          throw new BadRequestException(error.message)
        default:
          throw new ConflictException(error.message)
      }
    }

    return res.status(200).send(result.value)
  }
}
