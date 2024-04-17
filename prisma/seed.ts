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
      initials: 'PF1',
      email: 'pf1@example.com',
      password: hashedPassword,
    },
  })

  const customer1 = await prisma.customer.create({
    data: {
      id: '0e329bb8-25a8-4c7e-b683-61df6819aed7',
      hubId: 12,
      parcelForwardingId: parcelForwarding.id,
      firstName: 'Customer',
      lastName: 'One',
      email: 'customer1@example.com',
      password: hashedPassword,
    },
  })

  const customer2 = await prisma.customer.create({
    data: {
      id: 'd2198e4b-1b6b-4bec-9023-6bb1ac841671',
      hubId: 13,
      parcelForwardingId: parcelForwarding.id,
      firstName: 'Customer',
      lastName: 'Two',
      email: 'customer2@example.com',
      password: hashedPassword,
    },
  })

  const att = await prisma.attachment.create({
    data: {
      id: '1d0e3f27-892f-42be-bf19-f0373c8f2ac0',
      url: 'http://example.com',
    },
  })

  console.log({ parcelForwarding, customer1, customer2, att })
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
