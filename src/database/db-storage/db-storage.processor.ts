import { Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import * as fs from 'fs/promises';

@Injectable()
@Processor('fsOperationsQueue')
export class DbStorageProcessor {
  private readonly logger = new Logger(DbStorageProcessor.name);

  @Process('fsOperationsQueue/write')
  async writeDbFile(
    job: Job<{ folderPath: string; filePath: string; content: any }>,
  ) {
    const { folderPath, filePath, content } = job.data;

    try {
      await fs.mkdir(folderPath, { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(content, null, 2));

      return content;
    } catch (error) {
      this.logger.error(
        'PROCESSOR Error occurred while updating file:',
        error.message,
      );

      return null;
    }
  }

  @Process('fsOperationsQueue/read')
  async readFile(job: Job<{ filePath: string }>) {
    try {
      const content = await fs.readFile(job.data.filePath, 'utf8');
      const data = JSON.parse(content);

      return data;
    } catch (error) {
      this.logger.error('Error occurred while reading file:', error.message);

      return null;
    }
  }
}
