import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import * as path from 'path';

@Injectable()
export class DbStorageService {
  private readonly logger = new Logger(DbStorageService.name);

  private localDbFolder: string;

  constructor(
    @InjectQueue('fsOperationsQueue') private readonly fsOperationsQueue: Queue,
  ) {
    this.localDbFolder = path.join(__dirname, '../../db');
  }

  async doesDbFileExist(fileName: string) {
    const localDbFile = path.join(`${this.localDbFolder}/${fileName}.db.json`);

    try {
      const job = await this.fsOperationsQueue.add('fsOperationsQueue/read', {
        filePath: localDbFile,
      });
      const result = await job.finished();

      return result !== null;
    } catch (error) {
      this.logger.error('Error occurred while reading file:', error.message);

      return false;
    }
  }

  async writeDbFile(fileName: string, content = {}) {
    const localDbFile = path.join(`${this.localDbFolder}/${fileName}.db.json`);

    try {
      const job = await this.fsOperationsQueue.add('fsOperationsQueue/write', {
        folderPath: this.localDbFolder,
        filePath: localDbFile,
        content,
      });
      const result = await job.finished();

      return result !== null ? content : null;
    } catch (error) {
      this.logger.error('Error occurred while updating file:', error.message);

      return null;
    }
  }

  async readFile(fileName: string) {
    const localDbFile = path.join(`${this.localDbFolder}/${fileName}.db.json`);
    try {
      const job = await this.fsOperationsQueue.add('fsOperationsQueue/read', {
        filePath: localDbFile,
      });
      const result = await job.finished();

      return result !== null ? result : null;
    } catch (error) {
      this.logger.error('Error occurred while reading file:', error.message);

      return null;
    }
  }
}
