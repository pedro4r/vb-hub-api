import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CustomerFactory } from 'test/factories/make-customer'
import { ParcelForwardingFactory } from 'test/factories/make-parcel-forwarding'
import { ShippingAddressFactory } from 'test/factories/make-shipping-address'

describe('Fetch Shipping Address (E2E)', () => {
  let app: INestApplication

  let parcelForwardingFactory: ParcelForwardingFactory
  let customerFactory: CustomerFactory
  let shippingAddressFactory: ShippingAddressFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        ParcelForwardingFactory,
        CustomerFactory,
        ShippingAddressFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    parcelForwardingFactory = moduleRef.get(ParcelForwardingFactory)
    customerFactory = moduleRef.get(CustomerFactory)
    shippingAddressFactory = moduleRef.get(ShippingAddressFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /shipping-address', async () => {
    const parcelForwarding =
      await parcelForwardingFactory.makePrismaParcelForwarding()

    const customer = await customerFactory.makePrismaCustomer({
      parcelForwardingId: parcelForwarding.id,
    })

    await shippingAddressFactory.makePrismaShippingAddress({
      customerId: customer.id,
      recipientName: 'John Doe',
    })

    await shippingAddressFactory.makePrismaShippingAddress({
      customerId: customer.id,
      recipientName: 'Jane Doe',
    })

    const accessToken = jwt.sign(
      { sub: customer.id.toString() },
      { expiresIn: '1h' },
    )

    const cookie = `authToken=${accessToken}`

    const response = await request(app.getHttpServer())
      .get('/shipping-address')
      .set('Cookie', cookie)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      shippingAddresses: expect.arrayContaining([
        expect.objectContaining({ recipientName: 'John Doe' }),
        expect.objectContaining({ recipientName: 'Jane Doe' }),
      ]),
    })
  })
})
