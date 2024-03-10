import { AppModule } from '@/infra/app.module'
import { DatabseModule } from '@/infra/database/database.module'
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
      imports: [AppModule, DatabseModule],
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

    const accessToken = jwt.sign({ sub: parcelForwarding.id.toString() })

    const response = await request(app.getHttpServer())
      .get('/check-ins')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      checkIns: expect.arrayContaining([
        expect.objectContaining({ id: expect.any(String) }),
        expect.objectContaining({ id: expect.any(String) }),
      ]),
    })
  })
})
