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

describe('Fetch Recent Check-ins Details (E2E)', () => {
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
        ParcelForwardingFactory,
        CustomerFactory,
        AttachmentFactory,
        CheckInAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    parcelForwardingFactory = moduleRef.get(ParcelForwardingFactory)
    customerFactory = moduleRef.get(CustomerFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    checkInAttachmentFactory = moduleRef.get(CheckInAttachmentFactory)
    checkInFactory = moduleRef.get(CheckInFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /check-ins-details', async () => {
    const parcelForwarding =
      await parcelForwardingFactory.makePrismaParcelForwarding()

    const customer1 = await customerFactory.makePrismaCustomer({
      parcelForwardingId: parcelForwarding.id,
    })
    const customer2 = await customerFactory.makePrismaCustomer({
      parcelForwardingId: parcelForwarding.id,
    })

    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()
    const attachment3 = await attachmentFactory.makePrismaAttachment()
    const attachment4 = await attachmentFactory.makePrismaAttachment()

    const checkIn1 = await checkInFactory.makePrismaCheckIn({
      parcelForwardingId: parcelForwarding.id,
      customerId: customer1.id,
    })

    const checkIn2 = await checkInFactory.makePrismaCheckIn({
      parcelForwardingId: parcelForwarding.id,
      customerId: customer2.id,
    })

    await checkInAttachmentFactory.makePrismaCheckInAttachment({
      checkInId: checkIn1.id,
      attachmentId: attachment1.id,
    })

    await checkInAttachmentFactory.makePrismaCheckInAttachment({
      checkInId: checkIn1.id,
      attachmentId: attachment2.id,
    })

    await checkInAttachmentFactory.makePrismaCheckInAttachment({
      checkInId: checkIn2.id,
      attachmentId: attachment3.id,
    })

    await checkInAttachmentFactory.makePrismaCheckInAttachment({
      checkInId: checkIn2.id,
      attachmentId: attachment4.id,
    })

    const checkInOnDatabase = await prisma.checkIn.findMany()

    expect(checkInOnDatabase).toHaveLength(2)

    const checkInAttachmentOnDatabase =
      await prisma.checkInAttachment.findMany()

    expect(checkInAttachmentOnDatabase).toHaveLength(4)

    const attachmentOnDatabase = await prisma.attachment.findMany()

    expect(attachmentOnDatabase).toHaveLength(4)

    const accessToken = jwt.sign({ sub: parcelForwarding.id.toString() })

    const response = await request(app.getHttpServer())
      .get('/check-ins-details')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    console.log(response.body)
    expect(response.body).toEqual({
      checkInsDetails: expect.arrayContaining([
        expect.objectContaining({
          checkInId: expect.any(String),
          customerId: customer1.id.toString(),
          parcelForwardingId: parcelForwarding.id.toString(),
          attachments: expect.arrayContaining([expect.any(String)]),
        }),
        expect.objectContaining({
          checkInId: expect.any(String),
          customerId: customer2.id.toString(),
          parcelForwardingId: parcelForwarding.id.toString(),
          attachments: expect.arrayContaining([expect.any(String)]),
        }),
      ]),
    })
  })
})
