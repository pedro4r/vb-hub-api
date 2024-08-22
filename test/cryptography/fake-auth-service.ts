import { AuthService } from '@/core/cryptography/auth-service-repository'

export class FakeAuthService implements AuthService {
  async verifyToken(token: string): Promise<boolean> {
    if (token.length > 5) {
      return true
    }
    return false
  }
}
