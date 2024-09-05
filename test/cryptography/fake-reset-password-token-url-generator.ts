import { ResetPasswordTokenUrlParams, Token } from '@/core/cryptography/token'

export class FakeResetPasswordToken implements Token {
  async resetPasswordTokenUrl(
    data: ResetPasswordTokenUrlParams,
  ): Promise<string> {
    const { email, domainName } = data
    const randomNum = Math.floor(Math.random() * 1000000) + email
    const tokenUrl = `${domainName}/reset-password?token=${randomNum}`
    return tokenUrl
  }

  async decodeToken(token: string): Promise<string> {
    if (token.length === 6) {
      return 'joedoe@example.com'
    }

    throw new Error('Invalid or expired token')
  }
}
