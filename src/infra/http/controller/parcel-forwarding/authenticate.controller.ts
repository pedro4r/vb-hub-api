import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { WrongCredentialsError } from '@/domain/parcel-forwarding/application/use-cases/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/public'
import { Response } from 'express'
import { AuthenticateUseCase } from '@/domain/parcel-forwarding/application/use-cases/authenticate-parcel-forwarding'
import { ZodValidationPipe } from '../../pipe/zod-validation-pipe'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticate: AuthenticateUseCase) {}

  @Post('/login')
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema, @Res() res: Response) {
    const { email, password } = body

    const result = await this.authenticate.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    res.cookie('authToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 604800000,
    })

    return res.status(200).send()
  }

  @Post('/logout')
  async logout(@Res() res: Response) {
    // Limpa o cookie authToken
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    })

    return res.status(200).send({ message: 'Logout successful' })
  }
}
