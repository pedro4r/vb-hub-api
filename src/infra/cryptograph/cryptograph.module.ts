import { Module } from '@nestjs/common'

import { JwtEncrypter } from './jwt-encrypter'
import { BcryptHasher } from './bcrypt-hasher'
import { Encrypter } from '@/core/cryptography/encrypter'
import { HashComparer } from '@/core/cryptography/hash-compare'
import { HashGenerator } from '@/core/cryptography/hash-generator'
import { Token } from '@/core/cryptography/token'
import { ResetPasswordTokenUrlGenerator } from './token-generator'
import { EnvModule } from '../env/env.module'

@Module({
  imports: [EnvModule],
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
    { provide: Token, useClass: ResetPasswordTokenUrlGenerator },
  ],
  exports: [Encrypter, HashComparer, HashGenerator, Token],
})
export class CryptographyModule {}
