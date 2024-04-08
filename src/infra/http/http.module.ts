import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptograph/cryptograph.module'
import { DatabaseModule } from '../database/database.module'
import { StorageModule } from '../storage/storage.module'
import { CustomerModule } from './controller/customer.module'
import { ParcelForwardingModule } from './controller/parcel-forwarding.module'

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
    StorageModule,
    CustomerModule,
    ParcelForwardingModule,
  ],
})
export class HttpModule {}
