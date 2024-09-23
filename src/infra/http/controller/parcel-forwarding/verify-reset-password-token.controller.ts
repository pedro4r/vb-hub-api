import { Controller, Post, Body, GoneException, HttpCode } from '@nestjs/common'
import { VerifyResetPasswordTokenUseCase } from '@/domain/parcel-forwarding/application/use-cases/verify-reset-password-token'
import { Public } from '@/infra/auth/public'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipe/zod-validation-pipe'

const verifyResetPasswordTokenSchema = z.object({
  token: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(verifyResetPasswordTokenSchema)

type verifyResetPasswordTokenSchema = z.infer<
  typeof verifyResetPasswordTokenSchema
>
@Controller('verify-reset-password-token')
@Public()
export class VerifyResetPasswordTokenController {
  constructor(
    private verifyResetPasswordTokenUseCase: VerifyResetPasswordTokenUseCase,
  ) {}

  @Post()
  @HttpCode(200)
  async handle(@Body(bodyValidationPipe) body: verifyResetPasswordTokenSchema) {
    const { token } = body
    const result = await this.verifyResetPasswordTokenUseCase.execute({ token })

    if (result.isLeft()) {
      throw new GoneException(result.value.message)
    }

    const { email } = result.value
    return { email }
  }
}
