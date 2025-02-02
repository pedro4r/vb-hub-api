// import { ObjectType, Field, Int } from '@nestjs/graphql'
// import { GraphQLJSON } from 'graphql-type-json'

// // DTO para meta informações de FilteredCheckInsData
// @ObjectType()
// class MetaDTO {
//   @Field(() => Int)
//   pageIndex: number

//   @Field(() => Int)
//   perPage: number

//   @Field(() => Int)
//   totalCount: number

//   constructor(pageIndex: number, perPage: number, totalCount: number) {
//     this.pageIndex = pageIndex
//     this.perPage = perPage
//     this.totalCount = totalCount
//   }

//   static fromDomain(meta: {
//     pageIndex: number
//     perPage: number
//     totalCount: number
//   }) {
//     return new MetaDTO(meta.pageIndex, meta.perPage, meta.totalCount)
//   }
// }

// // DTO para CustomerPreview
// @ObjectType()
// class CustomerPreviewDTO {
//   @Field(() => String)
//   customerId: string

//   @Field(() => String)
//   parcelForwardingId: string

//   @Field(() => Int)
//   hubId: number

//   @Field(() => String)
//   firstName: string

//   @Field(() => String)
//   lastName: string

//   @Field(() => Date)
//   createdAt: Date

//   constructor(
//     customerId: string,
//     parcelForwardingId: string,
//     hubId: number,
//     firstName: string,
//     lastName: string,
//     createdAt: Date,
//   ) {
//     this.customerId = customerId
//     this.parcelForwardingId = parcelForwardingId
//     this.hubId = hubId
//     this.firstName = firstName
//     this.lastName = lastName
//     this.createdAt = createdAt
//   }

//   static fromDomain(customerPreview: any): CustomerPreviewDTO {
//     return new CustomerPreviewDTO(
//       customerPreview.customerId.toString(),
//       customerPreview.parcelForwardingId.toString(),
//       customerPreview.hubId,
//       customerPreview.firstName,
//       customerPreview.lastName,
//       customerPreview.createdAt,
//     )
//   }
// }

// // DTO principal combinando FilteredCheckInsData e CustomerPreview
// @ObjectType()
// export class CombinedCheckInsAndCustomerDTO {
//   @Field(() => [GraphQLJSON])
//   checkIns: Array<Record<string, any>>

//   @Field(() => MetaDTO)
//   meta: MetaDTO

//   @Field(() => [CustomerPreviewDTO])
//   customers: CustomerPreviewDTO[]

//   constructor(
//     checkIns: Array<Record<string, any>>,
//     meta: MetaDTO,
//     customers: CustomerPreviewDTO[],
//   ) {
//     this.checkIns = checkIns
//     this.meta = meta
//     this.customers = customers
//   }

//   static fromDomain(
//     filteredCheckInsData: any,
//     customerPreviews: any[],
//   ): CombinedCheckInsAndCustomerDTO {
//     const metaDTO = MetaDTO.fromDomain(filteredCheckInsData.meta)

//     const checkIns = filteredCheckInsData.checkIns.map((checkIn: any) =>
//       checkIn.toObject ? checkIn.toObject() : checkIn,
//     )

//     const customers = customerPreviews.map((customer) =>
//       CustomerPreviewDTO.fromDomain(customer),
//     )

//     return new CombinedCheckInsAndCustomerDTO(checkIns, metaDTO, customers)
//   }
// }
