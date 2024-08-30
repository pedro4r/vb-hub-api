import { FakeEmailSender } from 'test/email/fake-email-sender'
import { SendResetPasswordEmailUseCase } from './send-reset-password-email'

let emailSender: FakeEmailSender

let sut: SendResetPasswordEmailUseCase

describe('Send Reset Password Url Email', () => {
  beforeEach(() => {
    emailSender = new FakeEmailSender()

    sut = new SendResetPasswordEmailUseCase(emailSender)
  })

  it('should send reset password url email', async () => {
    const result = await sut.execute({
      sender: 'johndoe@example.com',
      recipient: 'alonsofts@gmail.com',
      tokenUrl: 'http://localhost:3000/reset-password?token=123456',
    })

    expect(result.isRight()).toBe(true)

    const result2 = await sut.execute({
      sender: 'johndoe@example.com',
      recipient: 'invalid-email',
      tokenUrl: 'http://localhost:3000/reset-password?token=123456',
    })

    expect(result2.isLeft()).toBe(true)
  })
})
