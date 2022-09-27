export interface ISubscriptionRepository {
  addOne(email: string): Promise<void>;

  findAll(): Promise<Array<string>>;
}
