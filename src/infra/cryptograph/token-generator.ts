import { Injectable } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import { ResetPasswordTokenUrlParams, Token } from '@/core/cryptography/token'
import { EnvService } from '@/infra/env/env.service'

@Injectable()
export class ResetPasswordTokenUrlGenerator extends Token {
  private readonly jwtSecret: string

  constructor(private envService: EnvService) {
    super()
    this.jwtSecret = this.envService.get('JWT_PRIVATE_KEY')
  }

  async resetPasswordTokenUrl(
    data: ResetPasswordTokenUrlParams,
  ): Promise<string> {
    const { email, domainName } = data
    const payload = { email }
    const token = jwt.sign(payload, this.jwtSecret, {
      expiresIn: '1h',
    })

    const tokenUrl = `${domainName}/reset-password?token=${token}`
    return tokenUrl
  }
}
