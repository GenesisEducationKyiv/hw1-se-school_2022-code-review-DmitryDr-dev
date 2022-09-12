import { SubscribeEmailDto } from '../dto';

export interface ISubscriptionController {
  subscribeEmail: (body: SubscribeEmailDto) => Promise<string>;

  sendEmails: () => Promise<PromiseSettledResult<unknown>[]>;
}
