import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create Shipping Address (E2E)', () => {
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

  test('[POST] /shipping-address', async () => {
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
      .post('/shipping-address')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        recipientName: 'Pedro',
        taxId: '123456',
        email: 'johndoe@example.com',
        phoneNumber: '123456',
        address: 'Millenia Blvd, 1234',
        complement: 'Apt 1',
        city: 'Orlando',
        state: 'FL',
        zipcode: '32839',
        country: 'USA',
      })

    expect(response.statusCode).toBe(201)

    const shippingAddressOnDatabase = await prisma.shippingAddress.findFirst({
      where: {
        customerId: customer.id,
      },
    })

    expect(shippingAddressOnDatabase).toBeTruthy()
  })
})
