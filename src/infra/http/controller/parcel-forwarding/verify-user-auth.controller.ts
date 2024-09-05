import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { Controller, Get, UseGuards, Res } from '@nestjs/common'
import { Response } from 'express'

@Controller('/protected')
export class VerifyUserAuthController {
  @Get()
  @UseGuards(JwtAuthGuard)
  getProtectedResource(@Res() res: Response) {
    return res.status(200).json({ message: 'This is a protected resource' })
  }
}
