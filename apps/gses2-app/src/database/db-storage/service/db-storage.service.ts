import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import * as path from 'path';
import { IDbStorageService } from './db-storage.service.interface';

@Injectable()
export class DbStorageService implements IDbStorageService {
  private readonly localDbFolder: string;

  constructor(
    @InjectQueue('fsOperationsQueue') private readonly fsOperationsQueue: Queue,
  ) {
    this.localDbFolder = path.join(__dirname, '../../db');
  }

  public async doesDbFileExist(fileName: string): Promise<boolean> {
    const localDbFile = path.join(`${this.localDbFolder}/${fileName}.db.json`);

    try {
      const job = await this.fsOperationsQueue.add('fsOperationsQueue/read', {
        filePath: localDbFile,
      });
      const result = await job.finished();

      return !!result;
    } catch (error) {
      return false;
    }
  }

  public async writeDbFile<T>(fileName: string, content: T): Promise<T> {
    const localDbFile = path.join(`${this.localDbFolder}/${fileName}.db.json`);

    try {
      const job = await this.fsOperationsQueue.add('fsOperationsQueue/write', {
        folderPath: this.localDbFolder,
        filePath: localDbFile,
        content,
      });
      const result: T = await job.finished();

      return result;
    } catch (error) {
      throw new Error(`Error occurred while updating file: ${error.message}`);
    }
  }

  public async readFile<T>(fileName: string): Promise<T> {
    const localDbFile = path.join(`${this.localDbFolder}/${fileName}.db.json`);
    try {
      const job = await this.fsOperationsQueue.add('fsOperationsQueue/read', {
        filePath: localDbFile,
      });
      const result: T = await job.finished();

      return result;
    } catch (error) {
      throw new Error(`Error occurred while reading file: ${error.message}`);
    }
  }
}
