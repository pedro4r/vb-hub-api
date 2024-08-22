// import { Injectable } from '@nestjs/common'
// import { PassportStrategy } from '@nestjs/passport'
// import { ExtractJwt, Strategy } from 'passport-jwt'
// import { JwtAuthService } from './jwt-auth-service'
// import { z } from 'zod'
// import { Request } from 'express'

// // Define o esquema para o payload do token JWT
// const tokenPayloadSchema = z.object({
//   sub: z.string().uuid(),
//   iat: z.number(),
// })

// export type UserPayload = z.infer<typeof tokenPayloadSchema>

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(private jwtAuthService: JwtAuthService) {
//     const publicKey = jwtAuthService.getPublicKey()

//     super({
//       jwtFromRequest: ExtractJwt.fromExtractors([
//         // Extrai o token JWT do cookie 'authToken'
//         (req: Request) => req.cookies?.authToken || null,
//       ]),
//       secretOrKey: Buffer.from(publicKey, 'base64'),
//       algorithms: ['RS256'],
//     })
//   }

//   async validate(payload: UserPayload) {
//     // Valida o payload do token JWT contra o esquema definido
//     try {
//       return tokenPayloadSchema.parse(payload)
//     } catch (error) {
//       // Pode adicionar tratamento de erro mais específico, se necessário
//       throw new Error('Invalid token payload')
//     }
//   }
// }
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'
import { Request } from 'express'
import { EnvService } from '../env/env.service'

const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
  iat: z.number(),
})

export type UserPayload = z.infer<typeof tokenPayloadSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: EnvService) {
    const publicKey = config.get('JWT_PUBLIC_KEY')

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // Extrair o token do cookie chamado 'authToken'
          let token = null
          if (request && request.cookies) {
            token = request.cookies.authToken
          }
          return token
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    })
  }

  async validate(payload: UserPayload) {
    return tokenPayloadSchema.parse(payload)
  }
}
