import { Resolver, Query, Args, Context, Info } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { FilterCheckInsUseCase } from '@/domain/parcel-forwarding/application/use-cases/filter-check-ins'
import { FilterPackagesUseCase } from '@/domain/parcel-forwarding/application/use-cases/filter-packages'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CombinedFilterResponseDTO } from '../schemas/customer/customer-profile-dto'
import { FieldNode, GraphQLResolveInfo, Kind } from 'graphql'
import { FilterCheckInsDetailsUseCase } from '@/domain/parcel-forwarding/application/use-cases/filter-check-ins-details'
import { GetCustomerByHubIdUseCase } from '@/domain/parcel-forwarding/application/use-cases/get-customer-by-hub-id'
import { FetchShippingAddressUseCase } from '@/domain/customer/application/use-cases/fetch-shipping-address'
import { FetchDeclarationModelsUseCase } from '@/domain/customer/application/use-cases/fetch-declaration-model'

@Resolver(() => CombinedFilterResponseDTO)
export class CustomerProfileResolver {
  constructor(
    private readonly filterCheckInsUseCase: FilterCheckInsUseCase,
    private readonly filterCheckInsDetailsUseCase: FilterCheckInsDetailsUseCase,
    private readonly filterPackagesUseCase: FilterPackagesUseCase,
    private readonly getCustomerByHubIdUseCase: GetCustomerByHubIdUseCase,
    private readonly fetchShippingAddressUseCase: FetchShippingAddressUseCase,
    private readonly fetchDeclarationModelsUseCase: FetchDeclarationModelsUseCase,
  ) {}

  @Query(() => CombinedFilterResponseDTO)
  @UseGuards(JwtAuthGuard)
  async getCustomerProfile(
    @Context() context,
    @Info() info: GraphQLResolveInfo,
    @Args('checkInsPage', { type: () => Number })
    checkInsPage: number,
    @Args('packagesPage', { type: () => Number })
    packagesPage: number,
    @Args('checkInsAttachmentsPage', { type: () => Number })
    checkInsAttachmentsPage: number,
    @Args('hubId', { type: () => Number }) hubId: number,
  ): Promise<CombinedFilterResponseDTO> {
    const user = context.req.user
    if (!user) {
      throw new Error('Unauthorized')
    }

    // Selection means the fields that the client is requesting
    const selections = info.fieldNodes[0]?.selectionSet?.selections
    if (!selections) {
      throw new Error('Invalid query structure')
    }

    const fields = selections
      .filter(
        (selection): selection is FieldNode => selection.kind === Kind.FIELD,
      )
      .map((selection: FieldNode) => selection.name.value)

    try {
      const customerResult = await this.getCustomerByHubIdUseCase.execute({
        parcelForwardingId: user.sub,
        hubId,
      })

      if (customerResult.isLeft()) {
        throw new Error('Customer not found')
      }

      const shippingAddressesPromise = fields.includes('shippingAddressesList')
        ? this.fetchShippingAddressUseCase.execute({
            customerId:
              customerResult.value.customerDetails.customerId.toString(),
          })
        : Promise.resolve(undefined)

      const declarationModelsPromise = fields.includes('declarationModelsList')
        ? this.fetchDeclarationModelsUseCase.execute({
            customerId:
              customerResult.value.customerDetails.customerId.toString(),
          })
        : Promise.resolve(undefined)

      const checkInsPromise = fields.includes('checkInsData')
        ? this.filterCheckInsUseCase.execute({
            parcelForwardingId: user.sub,
            hubId,
            page: checkInsPage,
          })
        : Promise.resolve(undefined)

      const checkInsDetailsPromise = fields.includes('checkInsDetailsData')
        ? this.filterCheckInsDetailsUseCase.execute({
            parcelForwardingId: user.sub,
            hubId,
            page: checkInsAttachmentsPage,
          })
        : Promise.resolve(undefined)

      const packagesPromise = fields.includes('packagesData')
        ? this.filterPackagesUseCase.execute({
            parcelForwardingId: user.sub,
            hubId,
            page: packagesPage,
          })
        : Promise.resolve(undefined)

      const [
        checkInsResult,
        checkInsDetailsResult,
        packagesResult,
        shippingAddressesResult,
        declarationModelsResult,
      ] = await Promise.all([
        checkInsPromise,
        checkInsDetailsPromise,
        packagesPromise,
        shippingAddressesPromise,
        declarationModelsPromise,
      ])

      const customerDetails = customerResult?.isRight()
        ? customerResult.value.customerDetails
        : undefined
      const checkInsData = checkInsResult?.isRight()
        ? checkInsResult.value.checkInsData
        : undefined
      const checkInsDetailsData = checkInsDetailsResult?.isRight()
        ? checkInsDetailsResult.value.checkInsAttachmentData
        : undefined
      const packagesData = packagesResult?.isRight()
        ? packagesResult.value.packagesData
        : undefined
      const shippingAddressesList = shippingAddressesResult?.isRight()
        ? shippingAddressesResult.value.shippingAddresses
        : undefined

      const declarationModelsList = declarationModelsResult?.isRight()
        ? declarationModelsResult.value.declarationModels
        : undefined

      return CombinedFilterResponseDTO.fromDomain(
        customerDetails,
        packagesData,
        checkInsData,
        checkInsDetailsData,
        shippingAddressesList,
        declarationModelsList,
      )
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred while fetching the customer profile')
    }
  }
}
