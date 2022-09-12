import { Module } from '@nestjs/common';
import { DbBinaryTreeModule } from '../db-binary-tree/db-binary-tree.module';
import { DbStorageModule } from '../db-storage/db-storage.module';
import { LocalDbService } from './service';

export const ILocalDbServiceToken = Symbol.for('ILocalDbService');

@Module({
  imports: [DbStorageModule, DbBinaryTreeModule],
  providers: [
    {
      provide: ILocalDbServiceToken,
      useClass: LocalDbService,
    },
  ],
  exports: [ILocalDbServiceToken],
})
export class LocalDbModule {}
