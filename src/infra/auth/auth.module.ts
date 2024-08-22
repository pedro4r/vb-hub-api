// import { Module } from '@nestjs/common'
// import { JwtModule } from '@nestjs/jwt'
// import { PassportModule } from '@nestjs/passport'
// import { JwtStrategy } from './jwt.strategy'
// import { APP_GUARD } from '@nestjs/core'
// import { JwtAuthGuard } from './jwt-auth.guard'
// import { EnvService } from '../env/env.service'
// import { EnvModule } from '../env/env.module'
// import { JwtAuthService } from './jwt-auth-service'
// import { AuthService } from '@/core/cryptography/auth-service-repository'

// @Module({
//   imports: [
//     PassportModule,
//     JwtModule.registerAsync({
//       imports: [EnvModule],
//       inject: [EnvService],
//       global: true,
//       useFactory(env: EnvService) {
//         const privateKey = env.get('JWT_PRIVATE_KEY')
//         const publicKey = env.get('JWT_PUBLIC_KEY')

//         return {
//           signOptions: { algorithm: 'RS256' },
//           privateKey: Buffer.from(privateKey, 'base64'), // Para assinar os tokens
//           publicKey: Buffer.from(publicKey, 'base64'), // Para verificar os tokens
//         }
//       },
//     }),
//   ],
//   providers: [
//     JwtStrategy,
//     EnvService,
//     JwtAuthService,
//     {
//       provide: APP_GUARD,
//       useClass: JwtAuthGuard,
//     },
//     {
//       provide: AuthService,
//       useClass: JwtAuthService,
//     },
//   ],
//   exports: [AuthService],
// })
// export class AuthModule {}

import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './jwt.strategy'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './jwt-auth.guard'
import { EnvService } from '../env/env.service'
import { EnvModule } from '../env/env.module'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory(env: EnvService) {
        const privateKey = env.get('JWT_PRIVATE_KEY')
        const publicKey = env.get('JWT_PUBLIC_KEY')

        return {
          signOptions: { algorithm: 'RS256' },
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
        }
      },
    }),
  ],
  providers: [
    JwtStrategy,
    EnvService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
