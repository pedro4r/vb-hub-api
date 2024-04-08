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
import { PackageFactory } from 'test/factories/make-package'
import { PackageShippingAddressFactory } from 'test/factories/make-package-shipping-address'
import { ParcelForwardingFactory } from 'test/factories/make-parcel-forwarding'

describe('Get Package (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let parcelForwardingFactory: ParcelForwardingFactory
  let customerFactory: CustomerFactory
  let packageShippingAddressFactory: PackageShippingAddressFactory
  let packageFactory: PackageFactory
  let attachmentFactory: AttachmentFactory
  let checkInAttachmentFactory: CheckInAttachmentFactory
  let checkInFactory: CheckInFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        PackageFactory,
        ParcelForwardingFactory,
        CustomerFactory,
        PackageShippingAddressFactory,
        AttachmentFactory,
        CheckInFactory,
        CheckInAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    parcelForwardingFactory = moduleRef.get(ParcelForwardingFactory)
    checkInFactory = moduleRef.get(CheckInFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    checkInAttachmentFactory = moduleRef.get(CheckInAttachmentFactory)
    customerFactory = moduleRef.get(CustomerFactory)
    packageShippingAddressFactory = moduleRef.get(PackageShippingAddressFactory)
    packageFactory = moduleRef.get(PackageFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /package/:id', async () => {
    const parcelForwarding =
      await parcelForwardingFactory.makePrismaParcelForwarding()

    const customer = await customerFactory.makePrismaCustomer({
      parcelForwardingId: parcelForwarding.id,
    })

    const packageShippingAddress1 =
      await packageShippingAddressFactory.makePrismaPackageShippingAddress({
        customerId: customer.id,
      })

    const pkg = await packageFactory.makePrismaPackage({
      customerId: customer.id,
      parcelForwardingId: parcelForwarding.id,
      shippingAddressId: packageShippingAddress1.id,
    })

    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()
    const attachment3 = await attachmentFactory.makePrismaAttachment()

    const checkIn1 = await checkInFactory.makePrismaCheckIn({
      customerId: customer.id,
      parcelForwardingId: parcelForwarding.id,
      packageId: pkg.id,
    })

    const checkIn2 = await checkInFactory.makePrismaCheckIn({
      customerId: customer.id,
      parcelForwardingId: parcelForwarding.id,
      packageId: pkg.id,
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

    const checkInOnDatabase = await prisma.checkIn.findMany()

    expect(checkInOnDatabase).toHaveLength(2)

    const checkInAttachmentOnDatabase =
      await prisma.checkInAttachment.findMany()

    expect(checkInAttachmentOnDatabase).toHaveLength(3)

    const attachmentOnDatabase = await prisma.attachment.findMany()

    expect(attachmentOnDatabase).toHaveLength(3)

    const accessToken = jwt.sign({ sub: parcelForwarding.id.toString() })

    const response = await request(app.getHttpServer())
      .get(`/package/${pkg.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      packageDetails: expect.objectContaining({
        packageId: pkg.id.toString(),
        customerId: customer.id.toString(),
        parcelForwardingId: parcelForwarding.id.toString(),
        customerFirstName: expect.any(String),
      }),
    })
  })
})
