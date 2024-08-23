import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CustomerFactory } from 'test/factories/make-customer'
import { DeclarationModelWithItemsFactory } from 'test/factories/make-declaration-model-with-items'
import { ParcelForwardingFactory } from 'test/factories/make-parcel-forwarding'

describe('Get Declaration Model (E2E)', () => {
  let app: INestApplication

  let prisma: PrismaService

  let parcelForwardingFactory: ParcelForwardingFactory
  let customerFactory: CustomerFactory
  let declarationModelWithItemsFactory: DeclarationModelWithItemsFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        ParcelForwardingFactory,
        CustomerFactory,
        DeclarationModelWithItemsFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    parcelForwardingFactory = moduleRef.get(ParcelForwardingFactory)
    customerFactory = moduleRef.get(CustomerFactory)
    declarationModelWithItemsFactory = moduleRef.get(
      DeclarationModelWithItemsFactory,
    )
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /declaration-model/:id', async () => {
    const parcelForwarding =
      await parcelForwardingFactory.makePrismaParcelForwarding()

    const customer = await customerFactory.makePrismaCustomer({
      parcelForwardingId: parcelForwarding.id,
    })

    const declarationModel =
      await declarationModelWithItemsFactory.makePrismaDeclarationModel({
        customerId: customer.id,
      })

    const accessToken = jwt.sign(
      { sub: customer.id.toString() },
      { expiresIn: '1h' },
    )

    const cookie = `authToken=${accessToken}`

    const response = await request(app.getHttpServer())
      .get(`/declaration-model/${declarationModel.id.toString()}`)
      .set('Cookie', cookie)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      declarationModel: expect.objectContaining({
        id: declarationModel.id.toString(),
      }),
    })

    const declarationModelOnDataBase = await prisma.declarationModel.findUnique(
      {
        where: {
          id: declarationModel.id.toString(),
        },
      },
    )

    expect(declarationModelOnDataBase).not.toBeNull()
  })
})
