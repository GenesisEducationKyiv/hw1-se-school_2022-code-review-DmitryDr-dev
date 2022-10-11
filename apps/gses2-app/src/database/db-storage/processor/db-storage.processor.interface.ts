import { Job } from 'bull';

export interface IDbStorageProcessor {
  writeDbFile<T>(
    job: Job<{
      folderPath: string;
      filePath: string;
      content: T;
    }>,
  ): Promise<T>;

  readFile<T>(job: Job<{ filePath: string }>): Promise<T>;
}
