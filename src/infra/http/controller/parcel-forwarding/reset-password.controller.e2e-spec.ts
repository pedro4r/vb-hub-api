import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ParcelForwardingFactory } from 'test/factories/make-parcel-forwarding'
import { EnvService } from '@/infra/env/env.service'
import * as jwt from 'jsonwebtoken'

describe('Reset Password (E2E)', () => {
  let app: INestApplication
  let parcelForwardingFactory: ParcelForwardingFactory
  let envService: EnvService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ParcelForwardingFactory, EnvService],
    }).compile()

    app = moduleRef.createNestApplication()
    parcelForwardingFactory = moduleRef.get(ParcelForwardingFactory)
    envService = moduleRef.get(EnvService)
    await app.init()
  })

  test('[POST] /reset-password', async () => {
    const parcelForwarding =
      await parcelForwardingFactory.makePrismaParcelForwarding()

    const jwtSecret = envService.get('JWT_PRIVATE_KEY')
    let token = jwt.sign({ email: parcelForwarding.email }, jwtSecret, {
      expiresIn: '1h',
    })

    const response = await request(app.getHttpServer())
      .post('/reset-password')
      .send({ token, newPassword: 'Abc123456@' })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({ success: true })

    token = jwt.sign({ email: parcelForwarding.email }, jwtSecret, {
      expiresIn: '1s',
    })

    await new Promise((resolve) => setTimeout(resolve, 3000))

    const response2 = await request(app.getHttpServer())
      .post('/verify-reset-password-token')
      .send({ token })

    expect(response2.statusCode).toBe(410)
    expect(response2.body.message).toBe(
      'Erro 410 - Link de redefinição de senha expirou',
    )
  })
})
