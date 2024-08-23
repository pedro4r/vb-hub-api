import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import cookieParser from 'cookie-parser'
import request from 'supertest'
import { ParcelForwardingFactory } from 'test/factories/make-parcel-forwarding'

describe('Verify Token (E2E)', () => {
  let app: INestApplication

  let parcelForwardingFactory: ParcelForwardingFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ParcelForwardingFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    parcelForwardingFactory = moduleRef.get(ParcelForwardingFactory)

    jwt = moduleRef.get(JwtService)
    app.use(cookieParser())
    await app.init()
  })

  test('[POST] /token-verify', async () => {
    const parcelForwarding =
      await parcelForwardingFactory.makePrismaParcelForwarding()

    const accessToken = jwt.sign(
      { sub: parcelForwarding.id.toString() },
      { expiresIn: '1h' },
    )

    const cookie = `authToken=${accessToken}`

    const response = await request(app.getHttpServer())
      .get('/token-verify')
      .set('Cookie', cookie)
      .send()

    expect(response.statusCode).toBe(200)
  })
})
