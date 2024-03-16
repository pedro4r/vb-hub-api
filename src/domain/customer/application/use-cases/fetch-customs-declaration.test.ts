import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryCustomsDeclarationRepository } from 'test/repositories/in-memory-customs-declaration-repository'
import { makeCustomsDeclaration } from 'test/factories/make-customs-declaration'
import { InMemoryCustomsDeclarationItemsRepository } from 'test/repositories/in-memory-customs-declaration-items-repository'
import { makeCustomsDeclarationItem } from 'test/factories/make-customs-declaration-item'
import { CustomsDeclarationList } from '../../enterprise/entities/customs-declaration-list'
import { FetchCustomsDeclarations } from './fetch-customs-declaration'

let inMemoryCustomsDeclarationItemsRepository: InMemoryCustomsDeclarationItemsRepository
let inMemoryCustomsDeclarationRepository: InMemoryCustomsDeclarationRepository
let sut: FetchCustomsDeclarations

describe('Fetch Customs Declarations', () => {
  beforeEach(async () => {
    inMemoryCustomsDeclarationItemsRepository =
      new InMemoryCustomsDeclarationItemsRepository()
    inMemoryCustomsDeclarationRepository =
      new InMemoryCustomsDeclarationRepository(
        inMemoryCustomsDeclarationItemsRepository,
      )
    sut = new FetchCustomsDeclarations(
      inMemoryCustomsDeclarationRepository,
      inMemoryCustomsDeclarationItemsRepository,
    )

    await Promise.all(
      new Array(7).fill(null).map(async (_, i) => {
        const customsDeclaration = makeCustomsDeclaration({
          customerId: new UniqueEntityID('customer-1'),
          title: `Customs Declaration ${i + 1}`,
        })

        const customsDeclarationItems = [
          makeCustomsDeclarationItem({
            customsDeclarationId: customsDeclaration.id,
          }),
          makeCustomsDeclarationItem({
            customsDeclarationId: customsDeclaration.id,
          }),
          makeCustomsDeclarationItem({
            customsDeclarationId: customsDeclaration.id,
          }),
        ]

        customsDeclaration.items = new CustomsDeclarationList(
          customsDeclarationItems,
        )

        return inMemoryCustomsDeclarationRepository.create(customsDeclaration)
      }),
    )
  })

  it('should be able to fetch customs declarations', async () => {
    const result = await sut.execute({
      customerId: 'customer-1',
    })

    expect(result.isRight()).toBeTruthy()

    expect(result.value).toEqual(
      expect.objectContaining({
        customsDeclarations: expect.arrayContaining(Array(7)),
      }),
    )

    expect.extend({
      toBeArrayOfSize(received, length: number) {
        const pass = Array.isArray(received) && received.length === length
        const message = pass
          ? () => `expected ${received} array length to be ${length}`
          : () => `expected ${received} array length to be ${length}`
        return { pass, message }
      },
    })

    expect(result.value).toEqual(
      expect.objectContaining({
        customsDeclarations: expect.arrayContaining([
          ...Array(7).fill(
            expect.objectContaining({
              customerId: new UniqueEntityID('customer-1'),
              title: expect.any(String),
              items: expect.objectContaining({
                currentItems: expect.toBeArrayOfSize(3),
              }),
            }),
          ),
        ]),
      }),
    )

    expect(inMemoryCustomsDeclarationRepository.items.length).toBe(7)
    expect(inMemoryCustomsDeclarationItemsRepository.items.length).toBe(21)
  })
})
