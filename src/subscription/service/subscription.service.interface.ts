export interface ISubscriptionService {
  addNewEmail: (email: string) => Promise<string>;

  sendEmails: () => Promise<PromiseSettledResult<unknown>[]>;
}
