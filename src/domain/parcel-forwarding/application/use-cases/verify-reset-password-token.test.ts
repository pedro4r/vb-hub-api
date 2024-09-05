import { FakeResetPasswordToken } from 'test/cryptography/fake-reset-password-token-url-generator'
import { VerifyResetPasswordTokenUseCase } from './verify-reset-password-token'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

let fakeResetPasswordToken: FakeResetPasswordToken

let sut: VerifyResetPasswordTokenUseCase

describe('Verify Reset Password Token', () => {
  beforeEach(() => {
    fakeResetPasswordToken = new FakeResetPasswordToken()

    sut = new VerifyResetPasswordTokenUseCase(fakeResetPasswordToken)
  })

  it('should verify password token', async () => {
    const token = '123456'

    const result = await sut.execute({
      token,
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not verify password token', async () => {
    const token = '1234567'

    const result = await sut.execute({
      token,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(
      new WrongCredentialsError('Invalid or expired token'),
    )
  })
})
