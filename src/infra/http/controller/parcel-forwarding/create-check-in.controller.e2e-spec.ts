import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'

describe('Create Check-in (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let attachmentFactory: AttachmentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /check-in', async () => {
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
        hubId: 13,
        firstName: 'Pedro',
        lastName: 'Requiao',
        email: 'alonsofts@gmail.com',
        password: '123456',
      },
    })

    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()

    const accessToken = jwt.sign({ sub: parcelForwarding.id })

    const response = await request(app.getHttpServer())
      .post('/check-in')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        parcel_forwarding_id: parcelForwarding.id,
        customerId: customer.id,
        details: 'New Check-in',
        weight: '10',
        attachmentsIds: [attachment1.id.toString(), attachment2.id.toString()],
      })

    expect(response.statusCode).toBe(201)

    const checkInOnDatabase = await prisma.checkIn.findFirst({
      where: {
        customerId: customer.id,
      },
    })

    expect(checkInOnDatabase).toBeTruthy()

    const checkInAttachmentsOnDatabase =
      await prisma.checkInAttachment.findMany({
        orderBy: {
          createdAt: 'asc',
        },
      })

    expect(checkInAttachmentsOnDatabase).toHaveLength(2)
    expect(checkInAttachmentsOnDatabase).toEqual([
      {
        id: expect.any(String),
        checkInId: expect.any(String),
        attachmentId: attachment1.id.toString(),
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        checkInId: expect.any(String),
        attachmentId: attachment2.id.toString(),
        createdAt: expect.any(Date),
      },
    ])
  })
})
