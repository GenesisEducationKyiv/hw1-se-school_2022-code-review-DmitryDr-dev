import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { DbStorageProcessor } from './db-storage.processor';
import { DbStorageService } from './db-storage.service';

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
