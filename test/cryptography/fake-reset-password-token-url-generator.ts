import { Token } from '@/core/cryptography/token'

export class FakeResetPasswordTokenUrlGenerator implements Token {
  async resetPasswordTokenUrl(email: string): Promise<string> {
    const randomNum = Math.floor(Math.random() * 1000000) + email // Gera um número aleatório entre 0 e 999999
    const tokenUrl = `http://vb-hub-fake/reset-password?token=${randomNum}`
    return tokenUrl
  }
}
