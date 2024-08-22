// // src/infra/auth/jwt-auth.service.ts
// import { AuthService } from '@/core/cryptography/auth-service-repository'
// import { Injectable } from '@nestjs/common'
// import { JwtService } from '@nestjs/jwt'

// @Injectable()
// export class JwtAuthService implements AuthService {
//   constructor(private jwtService: JwtService) {}

//   async verifyToken(token: string): Promise<boolean> {
//     try {
//       this.jwtService.verify(token, { secret: process.env.JWT_SECRET })
//       return true
//     } catch (error) {
//       return false
//     }
//   }

//   getPublicKey(): string {
//     const publicKey = process.env.JWT_PUBLIC_KEY
//     if (!publicKey) {
//       throw new Error('JWT_PUBLIC_KEY is not defined')
//     }
//     return publicKey
//   }
// }
