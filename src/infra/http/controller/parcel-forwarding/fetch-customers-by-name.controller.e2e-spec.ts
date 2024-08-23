import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import cookieParser from 'cookie-parser'

import request from 'supertest'
import { CustomerFactory } from 'test/factories/make-customer'
import { ParcelForwardingFactory } from 'test/factories/make-parcel-forwarding'

describe('Fetch Customers by Name (E2E)', () => {
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
    app.use(cookieParser())
    await app.init()
  })

  test('[GET] /customers/:name', async () => {
    const parcelForwarding =
      await parcelForwardingFactory.makePrismaParcelForwarding()

    const customer1 = await customerFactory.makePrismaCustomer({
      parcelForwardingId: parcelForwarding.id,
      firstName: 'John',
      lastName: 'Doe',
    })

    const customer2 = await customerFactory.makePrismaCustomer({
      parcelForwardingId: parcelForwarding.id,
      firstName: 'Jane',
      lastName: 'Doe',
    })

    const accessToken = jwt.sign(
      { sub: parcelForwarding.id.toString() },
      { expiresIn: '1h' },
    )

    const cookie = `authToken=${accessToken}`

    const response = await request(app.getHttpServer())
      .get('/customers/doe?page=1')
      .set('Cookie', cookie)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      customersPreview: expect.objectContaining({
        customers: expect.arrayContaining([
          expect.objectContaining({
            hubId: customer1.hubId,
            customerId: customer1.id.toString(),
            parcelForwardingId: customer1.parcelForwardingId.toString(),
            firstName: customer1.firstName,
            lastName: customer1.lastName,
            createdAt: expect.any(String),
          }),
          expect.objectContaining({
            hubId: customer2.hubId,
            customerId: customer2.id.toString(),
            parcelForwardingId: customer2.parcelForwardingId.toString(),
            firstName: customer2.firstName,
            lastName: customer2.lastName,
            createdAt: expect.any(String),
          }),
        ]),
        meta: expect.objectContaining({
          pageIndex: expect.any(Number),
          perPage: expect.any(Number),
          totalCount: expect.any(Number),
        }),
      }),
    })
  })
})
