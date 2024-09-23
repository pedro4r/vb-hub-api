import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Authenticate (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /parcel-forwarding/register', async () => {
    await prisma.parcelForwarding.create({
      data: {
        name: 'Voabox',
        initials: 'VBX',
        email: 'contato@voabox.com',
        password: await hash('123456', 8),
      },
    })

    const responseLogin = await request(app.getHttpServer())
      .post('/sessions/login')
      .send({
        email: 'contato@voabox.com',
        password: '123456',
      })

    expect(responseLogin.statusCode).toBe(200)

    const responseLogin2 = await request(app.getHttpServer())
      .post('/sessions/login')
      .send({
        email: 'contato@voabox.com',
        password: '1234567',
      })

    expect(responseLogin2.statusCode).toBe(401)

    const cookie = responseLogin.headers['set-cookie'][0]

    const responseLogout = await request(app.getHttpServer())
      .post('/sessions/logout')
      .set('Cookie', cookie) // Envia o cookie recebido no login
      .send()

    expect(responseLogout.statusCode).toBe(200)
  })
})
