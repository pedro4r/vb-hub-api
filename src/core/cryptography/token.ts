export abstract class Token {
  abstract resetPasswordTokenUrl(email: string): Promise<string>
}
