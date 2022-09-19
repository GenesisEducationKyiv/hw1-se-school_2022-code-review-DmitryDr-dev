import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { DbStorageService } from './service';
import { DbStorageProcessor } from './processor';

export const IDbStorageServiceToken = Symbol.for('IDbStorageServiceToken');
export const IDbStorageProcessorToken = Symbol.for('IDbStorageProcessorToken');

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'fsOperationsQueue',
    }),
  ],
  providers: [
    {
      provide: IDbStorageServiceToken,
      useClass: DbStorageService,
    },
    {
      provide: IDbStorageProcessorToken,
      useClass: DbStorageProcessor,
    },
  ],
  exports: [IDbStorageServiceToken],
})
export class DbStorageModule {}
