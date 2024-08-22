// import {
//   BadRequestException,
//   Controller,
//   Post,
//   Req,
//   Res,
//   UnauthorizedException,
// } from '@nestjs/common'
// import { Response, Request } from 'express'
// import { VerifyTokenUseCase } from '@/domain/parcel-forwarding/application/use-cases/verify-token'
// import { WrongCredentialsError } from '@/domain/parcel-forwarding/application/use-cases/errors/wrong-credentials-error'

// @Controller('/token-verify')
// export class VerifyTokenController {
//   constructor(private verifyTokenUseCase: VerifyTokenUseCase) {}

//   @Post()
//   async handle(@Req() req: Request, @Res() res: Response) {
//     try {
//       console.log('Request Cookies:', req.cookies) // Log dos cookies
//       const token = req.cookies.authToken

//       if (!token) {
//         throw new UnauthorizedException('No token provided')
//       }

//       const result = await this.verifyTokenUseCase.execute({
//         token,
//       })

//       if (result.isLeft()) {
//         const error = result.value

//         switch (error.constructor) {
//           case WrongCredentialsError:
//             throw new UnauthorizedException(error.message)
//           default:
//             throw new BadRequestException(error.message)
//         }
//       }

//       const { status } = result.value

//       return res.status(200).json({ status })
//     } catch (error) {
//       console.error('Error in VerifyTokenController:', error) // Log do erro
//       throw error
//     }
//   }
// }

import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { Controller, Get, UseGuards } from '@nestjs/common'

@Controller('/protected')
export class VerifyTokenController {
  @Get()
  @UseGuards(JwtAuthGuard)
  getProtectedResource() {
    return { message: 'This is a protected resource' }
  }
}
