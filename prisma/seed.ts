import { UniqueEntityID } from '../src/core/entities/unique-entity-id'
import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  await prisma.checkInAttachment.deleteMany()
  await prisma.attachment.deleteMany()
  await prisma.checkIn.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.parcelForwarding.deleteMany()

  const hashedPassword = await hash('123456', 8)

  const parcelForwarding = await prisma.parcelForwarding.create({
    data: {
      id: '3009842e-0800-4590-8be9-6378c941e8db',
      name: 'Parcel Forwarding 1',
      initials: faker.string.fromCharacters('ABCDEF', 3),
      email: 'contato@voabox.com',
      password: hashedPassword,
    },
  })

  const customersPromises = Array.from({ length: 30 }, async (_, index) => {
    const id = new UniqueEntityID()
    return await prisma.customer.create({
      data: {
        id: id.toString(),
        hubId: index + 1,
        parcelForwardingId: parcelForwarding.id,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        password: hashedPassword,
      },
    })
  })

  const customers = await Promise.all(customersPromises)

  console.log({ parcelForwarding, customers })
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
