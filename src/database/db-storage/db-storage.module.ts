import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { DbStorageProcessor } from './processor';
import { DbStorageService } from './service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'fsOperationsQueue',
    }),
  ],
  providers: [DbStorageService, DbStorageProcessor],
  exports: [DbStorageService],
})
export class DbStorageModule {}
