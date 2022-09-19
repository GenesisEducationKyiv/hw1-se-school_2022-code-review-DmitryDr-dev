import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import * as fs from 'fs/promises';
import { IDbStorageProcessor } from './db-storage.processor.interface';

@Injectable()
@Processor('fsOperationsQueue')
export class DbStorageProcessor implements IDbStorageProcessor {
  @Process('fsOperationsQueue/write')
  public async writeDbFile<T>(
    job: Job<{
      folderPath: string;
      filePath: string;
      content: T;
    }>,
  ): Promise<T> {
    const { folderPath, filePath, content } = job.data;

    await fs.mkdir(folderPath, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(content, null, 2));

    return content;
  }

  @Process('fsOperationsQueue/read')
  public async readFile<T>(job: Job<{ filePath: string }>): Promise<T> {
    const content = await fs.readFile(job.data.filePath, 'utf8');
    const data: T = JSON.parse(content);

    return data;
  }
}
