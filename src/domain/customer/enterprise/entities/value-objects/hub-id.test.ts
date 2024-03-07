import { HubId } from './hub-id'

describe('Create HubId', () => {
  it('should be able to create a new hubId', async () => {
    const hubId = HubId.create({
      parcelForwadingInitials: 'VX',
      customerCode: 1,
    })

    expect(hubId).toEqual(
      expect.objectContaining({
        parcelForwadingInitials: 'VX',
        customerCode: 1,
      }),
    )
  })
})
