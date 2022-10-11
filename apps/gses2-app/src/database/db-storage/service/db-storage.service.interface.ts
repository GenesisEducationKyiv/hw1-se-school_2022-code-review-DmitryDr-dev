export interface IDbStorageService {
  doesDbFileExist(fileName: string): Promise<boolean>;

  writeDbFile<T>(fileName: string, content: T): Promise<T>;

  readFile<T>(fileName: string): Promise<T>;
}
