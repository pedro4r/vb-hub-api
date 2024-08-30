import { ResetPasswordTokenUrlParams, Token } from '@/core/cryptography/token'

export class FakeResetPasswordTokenUrlGenerator implements Token {
  async resetPasswordTokenUrl(
    data: ResetPasswordTokenUrlParams,
  ): Promise<string> {
    const { email, domainName } = data
    const randomNum = Math.floor(Math.random() * 1000000) + email
    const tokenUrl = `${domainName}/reset-password?token=${randomNum}`
    return tokenUrl
  }
}
