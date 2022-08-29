import { Module } from '@nestjs/common';
import { DbBinaryTreeModule } from '../db-binary-tree/db-binary-tree.module';
import { DbStorageModule } from '../db-storage/db-storage.module';
import { LocalDbService } from './local-db.service';

@Module({
  imports: [DbStorageModule, DbBinaryTreeModule],
  providers: [LocalDbService],
  exports: [LocalDbService],
})
export class LocalDbModule {}
