import { Address } from '@/core/value-objects/address'
import { faker } from '@faker-js/faker'

export function makeAddress(): Address {
  const address = new Address({
    address: faker.location.streetAddress(),
    complement: faker.location.secondaryAddress(),
    state: faker.location.state(),
    zipcode: faker.location.zipCode(),
    country: faker.location.country(),
    city: faker.location.city(),
  })
  return address
}
