import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CheckInFactory } from 'test/factories/make-check-in'
import { CustomerFactory } from 'test/factories/make-customer'
import { ParcelForwardingFactory } from 'test/factories/make-parcel-forwarding'

describe('Fetch Recent Check-ins (E2E)', () => {
  let app: INestApplication
  let parcelForwardingFactory: ParcelForwardingFactory
  let customerFactory: CustomerFactory
  let checkInFactory: CheckInFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CheckInFactory, ParcelForwardingFactory, CustomerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    parcelForwardingFactory = moduleRef.get(ParcelForwardingFactory)
    customerFactory = moduleRef.get(CustomerFactory)
    checkInFactory = moduleRef.get(CheckInFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /check-ins', async () => {
    const parcelForwarding =
      await parcelForwardingFactory.makePrismaParcelForwarding()

    const customer1 = await customerFactory.makePrismaCustomer({
      parcelForwardingId: parcelForwarding.id,
    })
    const customer2 = await customerFactory.makePrismaCustomer({
      parcelForwardingId: parcelForwarding.id,
    })

    await Promise.all([
      checkInFactory.makePrismaCheckIn({
        parcelForwardingId: parcelForwarding.id,
        customerId: customer1.id,
      }),
      checkInFactory.makePrismaCheckIn({
        parcelForwardingId: parcelForwarding.id,
        customerId: customer2.id,
      }),
    ])

    const accessToken = jwt.sign(
      { sub: parcelForwarding.id.toString() },
      { expiresIn: '1h' },
    )

    const cookie = `authToken=${accessToken}`

    const response = await request(app.getHttpServer())
      .get('/check-ins')
      .set('Cookie', cookie)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      checkInsPreview: expect.arrayContaining([
        expect.objectContaining({
          checkInId: expect.any(String),
          customerId: customer1.id.toString(),
          parcelForwardingId: parcelForwarding.id.toString(),
        }),
        expect.objectContaining({
          checkInId: expect.any(String),
          customerId: customer2.id.toString(),
          parcelForwardingId: parcelForwarding.id.toString(),
        }),
      ]),
    })
  })
})
