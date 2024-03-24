import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create Declaration Model (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /declaration-model', async () => {
    const parcelForwarding = await prisma.parcelForwarding.create({
      data: {
        name: 'Voabox',
        initials: 'VBX',
        email: 'contato@voabox.com',
        password: '123456',
      },
    })

    const customer = await prisma.customer.create({
      data: {
        parcelForwardingId: parcelForwarding.id,
        hubId: 'VBX-123',
        name: 'Pedro',
        email: 'alonsofts@gmail.com',
        password: '123456',
      },
    })

    const accessToken = jwt.sign({ sub: customer.id })

    const response = await request(app.getHttpServer())
      .post('/declaration-model')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'My Declaration Model',
        declarationModelItems: [
          {
            description: 'Item 1',
            value: 10,
            quantity: 1,
          },
          {
            description: 'Item 2',
            value: 20,
            quantity: 2,
          },
        ],
      })

    expect(response.statusCode).toBe(201)

    const declarationModelOnDatabase = await prisma.declarationModel.findFirst({
      where: {
        customerId: customer.id,
      },
    })

    const declarationModelItemsOnDatabase =
      await prisma.declarationModelItem.findMany({
        where: {
          declarationModelId: declarationModelOnDatabase?.id,
        },
      })

    expect(declarationModelOnDatabase).toBeTruthy()
    expect(declarationModelItemsOnDatabase).toBeTruthy()
  })
})
