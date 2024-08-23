import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import cookieParser from 'cookie-parser'
import request from 'supertest'
import { ParcelForwardingFactory } from 'test/factories/make-parcel-forwarding'

describe('Upload Attachments (E2E)', () => {
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

  test('[POST] /attachments', async () => {
    const parcelForwarding =
      await parcelForwardingFactory.makePrismaParcelForwarding()

    const accessToken = jwt.sign(
      { sub: parcelForwarding.id.toString() },
      { expiresIn: '1h' },
    )

    const cookie = `authToken=${accessToken}`

    const response = await request(app.getHttpServer())
      .post('/attachments')
      .set('Cookie', cookie)
      .attach('file', './test/sample-upload.jpg')

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      attachmentId: expect.any(String),
    })
  })
})
