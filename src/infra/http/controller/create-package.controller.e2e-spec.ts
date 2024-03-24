import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CheckInFactory } from 'test/factories/make-check-in'
import { CustomerFactory } from 'test/factories/make-customer'
import { DeclarationModelWithItemsFactory } from 'test/factories/make-declaration-model-with-items'
import { ParcelForwardingFactory } from 'test/factories/make-parcel-forwarding'
import { ShippingAddressFactory } from 'test/factories/make-shipping-address'

describe('Create Package (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  let parcelForwardingFactory: ParcelForwardingFactory
  let customerFactory: CustomerFactory
  let shippingAddressFactory: ShippingAddressFactory
  let checkInFactory: CheckInFactory
  let declarationModelWithItemsFactory: DeclarationModelWithItemsFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        ParcelForwardingFactory,
        CustomerFactory,
        ShippingAddressFactory,
        CheckInFactory,
        DeclarationModelWithItemsFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    parcelForwardingFactory = moduleRef.get(ParcelForwardingFactory)
    shippingAddressFactory = moduleRef.get(ShippingAddressFactory)
    customerFactory = moduleRef.get(CustomerFactory)
    checkInFactory = moduleRef.get(CheckInFactory)
    declarationModelWithItemsFactory = moduleRef.get(
      DeclarationModelWithItemsFactory,
    )
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /package', async () => {
    const parcelForwarding =
      await parcelForwardingFactory.makePrismaParcelForwarding()

    const customer = await customerFactory.makePrismaCustomer({
      parcelForwardingId: parcelForwarding.id,
    })

    const shippingAddress =
      await shippingAddressFactory.makePrismaShippingAddress({
        customerId: customer.id,
      })

    const checkIn1 = await checkInFactory.makePrismaCheckIn({
      customerId: customer.id,
      parcelForwardingId: parcelForwarding.id,
    })

    const checkIn2 = await checkInFactory.makePrismaCheckIn({
      customerId: customer.id,
      parcelForwardingId: parcelForwarding.id,
    })

    const declarationModel =
      await declarationModelWithItemsFactory.makePrismaDeclarationModel({
        customerId: customer.id,
      })

    const accessToken = jwt.sign({ sub: customer.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/package')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        parcelForwardingId: parcelForwarding.id.toString(),
        shippingAddressId: shippingAddress.id.toString(),
        checkInsIds: [checkIn1.id.toString(), checkIn2.id.toString()],
        declarationModelId: declarationModel.id.toString(),
        hasBattery: true,
      })

    expect(response.statusCode).toBe(201)

    const packageOnDatabase = await prisma.package.findFirst({
      where: {
        customerId: customer.id.toString(),
      },
    })

    expect(packageOnDatabase).toBeTruthy()
  })
})
