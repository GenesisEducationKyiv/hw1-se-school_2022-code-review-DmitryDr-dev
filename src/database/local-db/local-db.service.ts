import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { LocalDbName } from 'src/common/constants';
import { DbBinaryTreeService } from '../db-binary-tree/db-binary-tree.service';
import { DbStorageService } from '../db-storage/db-storage.service';

@Injectable()
export class LocalDbService implements OnApplicationBootstrap {
  private readonly logger = new Logger(LocalDbService.name);

  constructor(
    private dbStorageService: DbStorageService,
    private dbBinaryTreeService: DbBinaryTreeService,
  ) {}

  public async onApplicationBootstrap() {
    try {
      const result = await this.dbStorageService.doesDbFileExist(
        LocalDbName.Email,
      );

      if (!result) {
        const newDb = this.dbBinaryTreeService.createTree();
        await this.dbStorageService.writeDbFile(LocalDbName.Email, newDb);
        return;
      }

      return;
    } catch (error) {
      this.logger.error('Error occurred while checking creating new DB file');
    }
  }

  public async addOne<T>(fileName: string, value: T) {
    try {
      const tree = await this.dbStorageService.readFile(fileName);
      const updatedTree = await this.dbBinaryTreeService.addValue(tree, value);

      if (!updatedTree) {
        this.logger.warn(` Value ${value} already exists in the database`);
        return null;
      }
      await this.dbStorageService.writeDbFile(fileName, updatedTree);

      return value;
    } catch (error) {
      this.logger.error(
        'Error occurred while adding new value:',
        error.message,
      );
      return null;
    }
  }

  public async findAll(fileName: string) {
    try {
      const data = await this.dbStorageService.readFile(fileName);
      const emails = await this.dbBinaryTreeService.getAllValues(data);

      if (!emails) {
        this.logger.warn(`Email list is empty`);
        return null;
      }

      return emails;
    } catch (error) {
      this.logger.error('Error occurred while reading file:', error.message);
      return null;
    }
  }
}
