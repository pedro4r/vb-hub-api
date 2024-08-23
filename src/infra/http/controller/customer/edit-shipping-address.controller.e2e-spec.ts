import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CustomerFactory } from 'test/factories/make-customer'
import { ParcelForwardingFactory } from 'test/factories/make-parcel-forwarding'
import { ShippingAddressFactory } from 'test/factories/make-shipping-address'

describe('Edit Shipping Address (E2E)', () => {
  let app: INestApplication

  let prisma: PrismaService

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

    prisma = moduleRef.get(PrismaService)
    parcelForwardingFactory = moduleRef.get(ParcelForwardingFactory)
    customerFactory = moduleRef.get(CustomerFactory)
    shippingAddressFactory = moduleRef.get(ShippingAddressFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /shipping-address/:id', async () => {
    const parcelForwarding =
      await parcelForwardingFactory.makePrismaParcelForwarding()

    const customer = await customerFactory.makePrismaCustomer({
      parcelForwardingId: parcelForwarding.id,
    })

    const shippingAddress =
      await shippingAddressFactory.makePrismaShippingAddress({
        customerId: customer.id,
      })

    const accessToken = jwt.sign(
      { sub: customer.id.toString() },
      { expiresIn: '1h' },
    )

    const cookie = `authToken=${accessToken}`

    const response = await request(app.getHttpServer())
      .put(`/shipping-address/${shippingAddress.id.toString()}`)
      .set('Cookie', cookie)
      .send({
        recipientName: 'Pedro Alonso',
        taxId: '123456',
        email: 'alonsofts@gmail.com',
        phoneNumber: '123456',
        address: 'Millenia Blvd, 1234',
        complement: 'Apt 1',
        city: 'Orlando',
        state: 'FL',
        zipcode: '32839',
        country: 'USA',
      })

    expect(response.statusCode).toBe(204)

    const shippingAddressOnDatabase = await prisma.shippingAddress.findFirst({
      where: {
        customerId: customer.id.toString(),
      },
    })

    expect(shippingAddressOnDatabase).toBeTruthy()
  })
})
