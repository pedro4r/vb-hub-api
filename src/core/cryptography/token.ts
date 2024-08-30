export interface ResetPasswordTokenUrlParams {
  email: string
  domainName: string
}

export abstract class Token {
  abstract resetPasswordTokenUrl(
    data: ResetPasswordTokenUrlParams,
  ): Promise<string>
}
