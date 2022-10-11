export interface ILocalDbService {
  onApplicationBootstrap(): Promise<void>;

  addOne(fileName: string, value: string): Promise<string>;

  findAll(fileName: string): Promise<Array<string>>;
}
