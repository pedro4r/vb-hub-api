export abstract class AuthService {
  abstract verifyToken(token: string): Promise<boolean>
}
