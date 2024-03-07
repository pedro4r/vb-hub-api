import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CustomerHubAddress } from './customer-hub-address'
import { HubId } from './hub-id'
import { makeParcelForwardingAddress } from 'test/factories/make-forwarding-address'

describe('Create Customer Hub Address', () => {
  it('should be able to create a new customer hub address', async () => {
    const parcelForwardingAddress = makeParcelForwardingAddress()

    const hubAddress = CustomerHubAddress.create({
      customerHubId: HubId.create({
        parcelForwadingInitials: 'VX',
        customerCode: 1,
      }),
      parcelForwardingAddress,
    })

    expect(hubAddress).toEqual(
      expect.objectContaining({
        customerHubId: expect.objectContaining({
          parcelForwadingInitials: 'VX',
          customerCode: 1,
        }),
        parcelForwardingAddress: expect.objectContaining({
          id: expect.any(UniqueEntityID),
        }),
      }),
    )
  })
})
