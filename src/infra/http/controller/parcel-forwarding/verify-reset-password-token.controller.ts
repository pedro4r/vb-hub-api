import { Controller, Get, Query, ForbiddenException } from '@nestjs/common'
import { VerifyResetPasswordTokenUseCase } from '@/domain/parcel-forwarding/application/use-cases/verify-reset-password-token'
import { Public } from '@/infra/auth/public'

@Controller('reset-password')
@Public()
export class VerifyResetPasswordTokenController {
  constructor(
    private verifyResetPasswordTokenUseCase: VerifyResetPasswordTokenUseCase,
  ) {}

  @Get()
  async verifyResetPasswordToken(@Query('token') token: string) {
    const result = await this.verifyResetPasswordTokenUseCase.execute({ token })

    if (result.isLeft()) {
      throw new ForbiddenException(result.value.message)
    }

    const { email } = result.value
    return { email }
  }
}
