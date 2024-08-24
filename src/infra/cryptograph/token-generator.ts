import { Injectable } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import { Token } from '@/core/cryptography/token'

@Injectable()
export class ResetPasswordTokenUrlGenerator extends Token {
  private readonly jwtSecret = 'seu-segredo-jwt' // Substitua por um segredo seguro

  async resetPasswordTokenUrl(email: string): Promise<string> {
    const payload = { email }
    const token = jwt.sign(payload, this.jwtSecret, {
      expiresIn: '1h', // Define o tempo de expiração do token
    })

    const tokenUrl = `https://seu-dominio.com/reset-password?token=${token}`
    return tokenUrl
  }
}
