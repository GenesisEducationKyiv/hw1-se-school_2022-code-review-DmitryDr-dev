export interface ISubscriptionService {
  addNewEmail: (email: string) => Promise<void>;

  sendEmails: () => Promise<PromiseSettledResult<unknown>[]>;
}
