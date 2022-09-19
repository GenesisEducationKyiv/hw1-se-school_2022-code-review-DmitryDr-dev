export interface ISubscriptionRepository {
  addOne(email: string): Promise<string>;

  findAll(): Promise<Array<string>>;
}
