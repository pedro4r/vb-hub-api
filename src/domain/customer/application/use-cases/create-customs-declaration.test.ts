import { InMemoryCustomsDeclarationRepository } from 'test/repositories/in-memory-customs-declaration-repository'
import { CreateCustomsDeclaration } from './create-customs-declaration'

let inMemoryCustomsDeclarationRepository: InMemoryCustomsDeclarationRepository
let sut: CreateCustomsDeclaration

describe('Create Customs Declaration', () => {
  beforeEach(() => {
    inMemoryCustomsDeclarationRepository =
      new InMemoryCustomsDeclarationRepository()
    sut = new CreateCustomsDeclaration(inMemoryCustomsDeclarationRepository)
  })

  it('should be able to create a customs declaration', async () => {
    const result = await sut.execute({
      customerId: '1',
      packageId: '1',
      itemsList: [
        {
          description: 'description',
          quantity: 1,
          value: 1,
        },
        {
          description: 'description2',
          quantity: 2,
          value: 2,
        },
      ],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCustomsDeclarationRepository.items[0]).toEqual(
      result.value?.customsDeclaration,
    )

    expect(
      inMemoryCustomsDeclarationRepository.items[0].itemList[1],
    ).toMatchObject({
      description: 'description2',
      quantity: 2,
      value: 2,
    })
  })
})
