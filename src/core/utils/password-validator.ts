export class PasswordValidator {
  private static readonly passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/

  static validate(password: string): boolean {
    return this.passwordRegex.test(password)
  }

  static getErrorMessage(): string {
    return 'A senha deve conter no mínimo 8 caracteres, incluindo maiúsculas, minúsculas, número e símbolo.'
  }
}
