import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Send Reset Password Email (E2E)', () => {
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

  test('[POST] /send-reset-password-email', async () => {
    await prisma.parcelForwarding.create({
      data: {
        name: 'Voabox',
        initials: 'VBX',
        email: 'contato@voabox.com',
        password: await hash('123456', 8),
      },
    })

    const response = await request(app.getHttpServer())
      .post('/send-reset-password-email')
      .send({
        email: 'contato@voabox.com',
      })

    expect(response.statusCode).toBe(200)

    const { resetPasswordTokenUrl } = response.body
    const url = new URL(resetPasswordTokenUrl)
    const token = url.searchParams.get('token')

    expect(token).not.toBeNull()
    expect(token).not.toBe('')
  })
})
