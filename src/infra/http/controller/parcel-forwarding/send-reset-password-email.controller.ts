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
import { SendResetPasswordEmailUseCase } from '@/domain/parcel-forwarding/application/use-cases/send-reset-password-email'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { EnvService } from '@/infra/env/env.service'

const authenticateBodySchema = z.object({
  email: z.string().email(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/send-reset-password-email')
@Public()
export class SendResetPasswordEmailController {
  constructor(
    private createPasswordResetUrl: CreatePasswordResetUrlUseCase,
    private sendResetPasswordEmail: SendResetPasswordEmailUseCase,
    private envService: EnvService, // Injetar o EnvService
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema, @Res() res: Response) {
    const { email } = body

    const result = await this.createPasswordResetUrl.execute({
      email,
      domainName: this.envService.get('DOMAIN_NAME'),
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

    const senderEmail = this.envService.get('SMTP_USER') // Obter o email do remetente das variáveis de ambiente

    const emailSentConfirmation = await this.sendResetPasswordEmail.execute({
      sender: senderEmail,
      recipient: email,
      tokenUrl: result.value.resetPasswordTokenUrl,
    })

    if (emailSentConfirmation.isLeft()) {
      const error = emailSentConfirmation.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new ConflictException(error.message)
      }
    }

    return res.status(200).send(result.value)
  }
}
