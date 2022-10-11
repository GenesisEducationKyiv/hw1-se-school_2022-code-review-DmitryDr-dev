import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { LocalDbName } from '../../../common/constants';
import { IBinaryTree } from '../../db-binary-tree/binary-tree';
import { ILocalDbService } from './local-db.service.interface';
import { IDbBinaryTreeServiceToken } from '../../db-binary-tree/db-binary-tree.module';
import { IDbBinaryTreeService } from '../../db-binary-tree/service';
import { IDbStorageServiceToken } from '../../db-storage/db-storage.module';
import { IDbStorageService } from '../../db-storage/service';

@Injectable()
export class LocalDbService implements OnApplicationBootstrap, ILocalDbService {
  constructor(
    @Inject(IDbStorageServiceToken)
    private readonly dbStorageService: IDbStorageService,
    @Inject(IDbBinaryTreeServiceToken)
    private readonly dbBinaryTreeService: IDbBinaryTreeService,
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    try {
      const result: boolean = await this.dbStorageService.doesDbFileExist(
        LocalDbName.Email,
      );

      if (!result) {
        const newDb: IBinaryTree<string> =
          this.dbBinaryTreeService.createTree();

        await this.dbStorageService.writeDbFile(LocalDbName.Email, newDb);

        return;
      }

      return;
    } catch (error) {
      throw new Error(`Error occurred while creating new DB file`);
    }
  }

  public async addOne(fileName: string, value: string): Promise<string> {
    try {
      const tree: IBinaryTree<string> = await this.dbStorageService.readFile(
        fileName,
      );
      const updatedTree: IBinaryTree<string> =
        await this.dbBinaryTreeService.addValue(tree, value);

      if (!updatedTree) {
        throw new Error(`Value ${value} already exists in database`);
      }

      await this.dbStorageService.writeDbFile(fileName, updatedTree);

      return value;
    } catch (error) {
      throw new Error(`Error occurred while adding value: ${error.message}`);
    }
  }

  public async findAll(fileName: string): Promise<Array<string>> {
    try {
      const data: IBinaryTree<string> = await this.dbStorageService.readFile(
        fileName,
      );
      const emails: Array<string> = await this.dbBinaryTreeService.getAllValues(
        data,
      );

      if (emails.length === 0) {
        throw new Error(`Email list is empty`);
      }

      return emails;
    } catch (error) {
      throw new Error(`Error occurred while reading file: ${error.message}`);
    }
  }
}
