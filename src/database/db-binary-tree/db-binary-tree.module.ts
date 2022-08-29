import { Module } from '@nestjs/common';
import { DbBinaryTreeService } from './db-binary-tree.service';

@Module({
  providers: [DbBinaryTreeService],
  exports: [DbBinaryTreeService],
})
export class DbBinaryTreeModule {}
