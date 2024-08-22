import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Verify Token (E2E)', () => {
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

  test('[POST] /token-verify', async () => {
    await prisma.parcelForwarding.create({
      data: {
        name: 'Voabox',
        initials: 'VBX',
        email: 'contato@voabox.com',
        password: await hash('123456', 8),
      },
    })

    const loginResponse = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: 'contato@voabox.com',
        password: '123456',
      })

    const cookies = loginResponse.headers['set-cookie']

    console.log('Cookies:', cookies)

    const response = await request(app.getHttpServer())
      .post('/token-verify')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('status')
  })
})
