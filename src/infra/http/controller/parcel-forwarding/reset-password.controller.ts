import {
  Controller,
  Post,
  Body,
  GoneException,
  HttpCode,
  NotFoundException,
} from '@nestjs/common'
import { Public } from '@/infra/auth/public'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipe/zod-validation-pipe'
import { ResetParcelForwardingPasswordUseCase } from '@/domain/parcel-forwarding/application/use-cases/reset-password'
import { VerifyResetPasswordTokenUseCase } from '@/domain/parcel-forwarding/application/use-cases/verify-reset-password-token'

const verifyResetPasswordTokenSchema = z.object({
  token: z.string(),
  newPassword: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(verifyResetPasswordTokenSchema)

type verifyResetPasswordTokenSchema = z.infer<
  typeof verifyResetPasswordTokenSchema
>
@Controller('/reset-password')
@Public()
export class ResetParcelForwardingPasswordController {
  constructor(
    private verifyResetPasswordTokenUseCase: VerifyResetPasswordTokenUseCase,
    private resetParcelForwardingPasswordUseCase: ResetParcelForwardingPasswordUseCase,
  ) {}

  @Post()
  @HttpCode(200)
  async handle(@Body(bodyValidationPipe) body: verifyResetPasswordTokenSchema) {
    const { token, newPassword } = body

    const result = await this.verifyResetPasswordTokenUseCase.execute({ token })

    if (result.isLeft()) {
      throw new GoneException(result.value.message)
    }

    const { email } = result.value

    const response = await this.resetParcelForwardingPasswordUseCase.execute({
      email,
      newPassword,
    })

    if (response.isLeft()) {
      throw new NotFoundException(response.value.message)
    }

    return { success: true }
  }
}
