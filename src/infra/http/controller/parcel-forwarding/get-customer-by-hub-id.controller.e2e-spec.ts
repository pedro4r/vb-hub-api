import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CustomerFactory } from 'test/factories/make-customer'
import { ParcelForwardingFactory } from 'test/factories/make-parcel-forwarding'

describe('Get Customer by Hub ID (E2E)', () => {
  let app: INestApplication

  let parcelForwardingFactory: ParcelForwardingFactory
  let customerFactory: CustomerFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CustomerFactory, ParcelForwardingFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    parcelForwardingFactory = moduleRef.get(ParcelForwardingFactory)
    customerFactory = moduleRef.get(CustomerFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /customer/:id', async () => {
    const parcelForwarding =
      await parcelForwardingFactory.makePrismaParcelForwarding()

    const customer = await customerFactory.makePrismaCustomer({
      parcelForwardingId: parcelForwarding.id,
    })

    const accessToken = jwt.sign(
      { sub: parcelForwarding.id.toString() },
      { expiresIn: '1h' },
    )

    const cookie = `authToken=${accessToken}`

    const response = await request(app.getHttpServer())
      .get(`/customer/${customer.hubId.toString()}`)
      .set('Cookie', cookie)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      customerPreview: expect.objectContaining({
        firstName: expect.any(String),
        lastName: expect.any(String),
        hubId: expect.any(Number),
      }),
    })
  })
})
