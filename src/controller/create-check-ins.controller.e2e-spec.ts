import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create Check-in (E2E)', () => {
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

  test('[POST] /check-in', async () => {
    const customer = await prisma.customer.create({
      data: {
        name: 'Pedro',
        email: 'alonsofts@gmail.com',
        password: '123456',
      },
    })

    const parcelForwarding = await prisma.parcelForwarding.create({
      data: {
        name: 'Voabox',
        initials: 'VBX',
        email: 'contato@voabox.com',
        password: '123456',
      },
    })

    const accessToken = jwt.sign({ sub: parcelForwarding.id })

    const response = await request(app.getHttpServer())
      .post('/check-in')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        parcel_forwarding_id: parcelForwarding.id,
        customerId: customer.id,
        details: 'New Check-in',
        weight: '10',
      })

    expect(response.statusCode).toBe(201)

    const checkInOnDatabase = await prisma.checkIn.findFirst({
      where: {
        customer_id: customer.id,
      },
    })

    expect(checkInOnDatabase).toBeTruthy()
  })
})
