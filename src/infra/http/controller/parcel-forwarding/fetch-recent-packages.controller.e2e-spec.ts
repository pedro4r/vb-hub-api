import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CustomerFactory } from 'test/factories/make-customer'
import { PackageFactory } from 'test/factories/make-package'
import { PackageShippingAddressFactory } from 'test/factories/make-package-shipping-address'
import { ParcelForwardingFactory } from 'test/factories/make-parcel-forwarding'

describe('Fetch Recent Packages (E2E)', () => {
  let app: INestApplication
  let parcelForwardingFactory: ParcelForwardingFactory
  let customerFactory: CustomerFactory
  let packageShippingAddressFactory: PackageShippingAddressFactory
  let packageFactory: PackageFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        PackageFactory,
        ParcelForwardingFactory,
        CustomerFactory,
        PackageShippingAddressFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    parcelForwardingFactory = moduleRef.get(ParcelForwardingFactory)
    customerFactory = moduleRef.get(CustomerFactory)
    packageShippingAddressFactory = moduleRef.get(PackageShippingAddressFactory)
    packageFactory = moduleRef.get(PackageFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /packages', async () => {
    const parcelForwarding =
      await parcelForwardingFactory.makePrismaParcelForwarding()

    const customer1 = await customerFactory.makePrismaCustomer({
      parcelForwardingId: parcelForwarding.id,
    })
    const customer2 = await customerFactory.makePrismaCustomer({
      parcelForwardingId: parcelForwarding.id,
    })

    const packageShippingAddress1 =
      await packageShippingAddressFactory.makePrismaPackageShippingAddress({
        customerId: customer1.id,
      })

    const packageShippingAddress2 =
      await packageShippingAddressFactory.makePrismaPackageShippingAddress({
        customerId: customer1.id,
      })

    await Promise.all([
      packageFactory.makePrismaPackage({
        customerId: customer1.id,
        parcelForwardingId: parcelForwarding.id,
        shippingAddressId: packageShippingAddress1.id,
      }),
      packageFactory.makePrismaPackage({
        customerId: customer2.id,
        parcelForwardingId: parcelForwarding.id,
        shippingAddressId: packageShippingAddress2.id,
      }),
    ])

    const accessToken = jwt.sign(
      { sub: parcelForwarding.id.toString() },
      { expiresIn: '1h' },
    )

    const cookie = `authToken=${accessToken}`

    const response = await request(app.getHttpServer())
      .get('/packages')
      .set('Cookie', cookie)
      .send()

    expect(response.statusCode).toBe(200)

    // expect(response.body).toEqual({
    //   packagesPreviews: expect.arrayContaining([
    //     expect.objectContaining({
    //       packageId: expect.any(String),
    //       customerId: customer1.id.toString(),
    //     }),
    //     expect.objectContaining({
    //       packageId: expect.any(String),
    //       customerId: customer2.id.toString(),
    //     }),
    //   ]),
    // })

    expect(response.body).toEqual({
      packagesPreviews: expect.objectContaining({
        packages: expect.arrayContaining([
          expect.objectContaining({
            packageId: expect.any(String),
            customerId: customer1.id.toString(),
          }),
          expect.objectContaining({
            packageId: expect.any(String),
            customerId: customer2.id.toString(),
          }),
        ]),
      }),
    })
  })
})
