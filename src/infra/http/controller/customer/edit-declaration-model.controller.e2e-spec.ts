import { UniqueEntityID } from '@/core/entities/unique-entity-id'
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

describe('Edit Declaration Model (E2E)', () => {
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

  test('[PUT] /declaration-model/:id', async () => {
    const parcelForwarding =
      await parcelForwardingFactory.makePrismaParcelForwarding()

    const customer = await customerFactory.makePrismaCustomer({
      parcelForwardingId: parcelForwarding.id,
    })

    const declarationModelWithItems =
      await declarationModelWithItemsFactory.makePrismaDeclarationModel({
        customerId: customer.id,
      })

    const itemsWithoutFirstOnePlusNewOne = [
      ...declarationModelWithItems.items.currentItems
        .map((item) => ({
          id: item.id.toString(),
          declarationModelId: item.declarationModelId.toString(),
          description: item.description,
          value: 10,
          quantity: item.quantity,
        }))
        .filter((item) => item.description !== 'Item 1'),
      {
        id: new UniqueEntityID().toString(),
        declarationModelId: declarationModelWithItems.id.toString(),
        description: 'New Item',
        value: 100,
        quantity: 1,
      },
    ]

    const accessToken = jwt.sign(
      { sub: customer.id.toString() },
      { expiresIn: '1h' },
    )

    const cookie = `authToken=${accessToken}`

    const response = await request(app.getHttpServer())
      .put(`/declaration-model/${declarationModelWithItems.id.toString()}`)
      .set('Cookie', cookie)
      .send({
        title: 'New title',
        declarationModelItems: itemsWithoutFirstOnePlusNewOne,
      })

    expect(response.statusCode).toBe(204)

    const declarationModelOnDatabase = await prisma.declarationModel.findUnique(
      {
        where: {
          id: declarationModelWithItems.id.toString(),
        },
      },
    )

    expect(declarationModelOnDatabase).toBeTruthy()
    expect(declarationModelOnDatabase?.title).toBe('New title')

    const declarationModelItemsOnDatabase =
      await prisma.declarationModelItem.findMany({
        where: {
          declarationModelId: declarationModelWithItems.id.toString(),
        },
        orderBy: {
          createdAt: 'asc',
        },
      })

    expect(declarationModelItemsOnDatabase).toHaveLength(3)
    expect(declarationModelItemsOnDatabase[0]).toMatchObject({
      description: 'Item 2',
      value: 10,
    })
    expect(declarationModelItemsOnDatabase[1]).toMatchObject({
      description: 'Item 3',
      value: 10,
    })

    expect(declarationModelItemsOnDatabase[2]).toMatchObject({
      description: 'New Item',
      value: 100,
    })
  })
})
