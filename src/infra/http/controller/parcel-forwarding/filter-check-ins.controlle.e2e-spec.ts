import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CheckInFactory } from 'test/factories/make-check-in'
import { CustomerFactory } from 'test/factories/make-customer'
import { ParcelForwardingFactory } from 'test/factories/make-parcel-forwarding'

describe('Filter Check-ins (E2E)', () => {
  let app: INestApplication
  let parcelForwardingFactory: ParcelForwardingFactory
  let customerFactory: CustomerFactory
  let checkInFactory: CheckInFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CheckInFactory, ParcelForwardingFactory, CustomerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    parcelForwardingFactory = moduleRef.get(ParcelForwardingFactory)
    customerFactory = moduleRef.get(CustomerFactory)
    checkInFactory = moduleRef.get(CheckInFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /filter-check-ins', async () => {
    const parcelForwarding =
      await parcelForwardingFactory.makePrismaParcelForwarding()

    const customer1 = await customerFactory.makePrismaCustomer({
      hubId: 1,
      parcelForwardingId: parcelForwarding.id,
      firstName: 'John Doe',
    })
    const customer2 = await customerFactory.makePrismaCustomer({
      hubId: 2,
      parcelForwardingId: parcelForwarding.id,
      firstName: 'Jane Doe',
    })

    const customer3 = await customerFactory.makePrismaCustomer({
      hubId: 3,
      parcelForwardingId: parcelForwarding.id,
      firstName: 'Mary Doe',
    })

    const checkIn1 = await checkInFactory.makePrismaCheckIn({
      parcelForwardingId: parcelForwarding.id,
      customerId: customer1.id,
      status: 1,
      createdAt: new Date('2021-01-01'),
    })

    const checkIn2 = await checkInFactory.makePrismaCheckIn({
      parcelForwardingId: parcelForwarding.id,
      customerId: customer2.id,
      status: 2,
      createdAt: new Date('2021-02-01'),
    })

    await checkInFactory.makePrismaCheckIn({
      parcelForwardingId: parcelForwarding.id,
      customerId: customer2.id,
      status: 1,
      createdAt: new Date('2021-03-01'),
    })

    await checkInFactory.makePrismaCheckIn({
      parcelForwardingId: parcelForwarding.id,
      customerId: customer3.id,
      status: 1,
      createdAt: new Date('2021-04-01'),
    })

    const accessToken = jwt.sign(
      { sub: parcelForwarding.id.toString() },
      { expiresIn: '1h' },
    )

    const cookie = `authToken=${accessToken}`

    const response = await request(app.getHttpServer())
      .post('/filter-check-ins?page=1')
      .set('Cookie', cookie)
      .send({
        hubId: 1,
        status: 1,
      })

    expect(response.statusCode).toBe(201)

    console.log(response.body)

    expect(response.body).toEqual(
      expect.objectContaining({
        checkInsPreview: expect.objectContaining({
          checkIns: expect.arrayContaining([
            expect.objectContaining({
              checkInId: checkIn1.id.toString(),
              customerId: customer1.id.toString(),
              parcelForwardingId: parcelForwarding.id.toString(),
            }),
          ]),
          meta: expect.objectContaining({
            pageIndex: expect.any(Number),
            perPage: expect.any(Number),
            totalCount: expect.any(Number),
          }),
        }),
      }),
    )

    const response2 = await request(app.getHttpServer())
      .post('/filter-check-ins?page=1')
      .set('Cookie', cookie)
      .send({
        customerName: 'j',
        status: 2,
        startDate: '2021-02-01T00:00:00.000Z',
        endDate: '2021-02-01T23:59:59.999Z',
      })

    expect(response2.statusCode).toBe(201)

    expect(response2.body).toEqual(
      expect.objectContaining({
        checkInsPreview: expect.objectContaining({
          checkIns: expect.arrayContaining([
            expect.objectContaining({
              checkInId: checkIn2.id.toString(),
              customerId: customer2.id.toString(),
              parcelForwardingId: parcelForwarding.id.toString(),
            }),
          ]),
          meta: expect.objectContaining({
            pageIndex: expect.any(Number),
            perPage: expect.any(Number),
            totalCount: expect.any(Number),
          }),
        }),
      }),
    )
  })
})
