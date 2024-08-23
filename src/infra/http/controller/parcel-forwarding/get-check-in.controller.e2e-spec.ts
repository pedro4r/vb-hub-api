import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { CheckInFactory } from 'test/factories/make-check-in'
import { CheckInAttachmentFactory } from 'test/factories/make-check-in-attachment'
import { CustomerFactory } from 'test/factories/make-customer'
import { ParcelForwardingFactory } from 'test/factories/make-parcel-forwarding'

describe('Get Check-in (E2E)', () => {
  let app: INestApplication

  let prisma: PrismaService

  let parcelForwardingFactory: ParcelForwardingFactory
  let customerFactory: CustomerFactory
  let attachmentFactory: AttachmentFactory
  let checkInAttachmentFactory: CheckInAttachmentFactory
  let checkInFactory: CheckInFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        CheckInFactory,
        CustomerFactory,
        ParcelForwardingFactory,
        AttachmentFactory,
        CheckInAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    parcelForwardingFactory = moduleRef.get(ParcelForwardingFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    checkInAttachmentFactory = moduleRef.get(CheckInAttachmentFactory)
    customerFactory = moduleRef.get(CustomerFactory)
    checkInFactory = moduleRef.get(CheckInFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /check-in/:id', async () => {
    const parcelForwarding =
      await parcelForwardingFactory.makePrismaParcelForwarding()

    const customer = await customerFactory.makePrismaCustomer({
      parcelForwardingId: parcelForwarding.id,
    })

    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()

    const checkIn = await checkInFactory.makePrismaCheckIn({
      customerId: customer.id,
      parcelForwardingId: parcelForwarding.id,
    })

    await checkInAttachmentFactory.makePrismaCheckInAttachment({
      checkInId: checkIn.id,
      attachmentId: attachment1.id,
    })

    await checkInAttachmentFactory.makePrismaCheckInAttachment({
      checkInId: checkIn.id,
      attachmentId: attachment2.id,
    })

    const checkInOnDatabase = await prisma.checkIn.findUnique({
      where: {
        id: checkIn.id.toString(),
      },
    })

    expect(checkInOnDatabase).not.toBeNull()

    const checkInAttachmentOnDatabase = await prisma.checkInAttachment.findMany(
      {
        where: {
          checkInId: checkIn.id.toString(),
        },
      },
    )

    expect(checkInAttachmentOnDatabase).toHaveLength(2)

    const attachmentOnDatabase = await prisma.attachment.findMany()

    expect(attachmentOnDatabase).toHaveLength(2)

    const accessToken = jwt.sign(
      { sub: parcelForwarding.id.toString() },
      { expiresIn: '1h' },
    )

    const cookie = `authToken=${accessToken}`

    const response = await request(app.getHttpServer())
      .get(`/check-in/${checkIn.id.toString()}`)
      .set('Cookie', cookie)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      checkInDetails: expect.objectContaining({
        status: expect.any(String),
        attachments: expect.arrayContaining([expect.any(String)]),
      }),
    })
  })
})
