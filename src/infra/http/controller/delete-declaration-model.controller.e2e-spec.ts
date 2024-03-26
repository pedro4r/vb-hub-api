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

describe('Delete Declaration Model (E2E)', () => {
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

  test('[DELETE] /declaration-model/:id', async () => {
    const parcelForwarding =
      await parcelForwardingFactory.makePrismaParcelForwarding()

    const customer = await customerFactory.makePrismaCustomer({
      parcelForwardingId: parcelForwarding.id,
    })

    const declarationModel =
      await declarationModelWithItemsFactory.makePrismaDeclarationModel({
        customerId: customer.id,
      })

    let declarationModelOnDataBase = await prisma.declarationModel.findUnique({
      where: {
        id: declarationModel.id.toString(),
      },
    })

    expect(declarationModelOnDataBase).not.toBeNull()

    let declarationModelItemsOnDataBase =
      await prisma.declarationModelItem.findMany({
        where: {
          declarationModelId: declarationModel.id.toString(),
        },
      })

    expect(declarationModelItemsOnDataBase).not.toBeNull()

    const accessToken = jwt.sign({ sub: customer.id.toString() })

    const response = await request(app.getHttpServer())
      .delete(`/declaration-model/${declarationModel.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    declarationModelOnDataBase = await prisma.declarationModel.findUnique({
      where: {
        id: declarationModel.id.toString(),
      },
    })
    expect(declarationModelOnDataBase).toBeNull()

    declarationModelItemsOnDataBase =
      await prisma.declarationModelItem.findMany({
        where: {
          declarationModelId: declarationModel.id.toString(),
        },
      })

    expect(declarationModelItemsOnDataBase).toHaveLength(0)
  })
})
