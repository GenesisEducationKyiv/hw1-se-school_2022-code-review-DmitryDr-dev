import { Module } from '@nestjs/common';
import { DbBinaryTreeService } from './service/db-binary-tree.service';

export const IDbBinaryTreeServiceToken = Symbol.for('IDbBinaryTreeService');

@Module({
  providers: [
    {
      provide: IDbBinaryTreeServiceToken,
      useClass: DbBinaryTreeService,
    },
  ],
  exports: [IDbBinaryTreeServiceToken],
})
export class DbBinaryTreeModule {}
