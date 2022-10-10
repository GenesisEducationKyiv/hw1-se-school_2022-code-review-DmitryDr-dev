import {
  CreateSubscriberRequestDto,
  UpdateSubscriberStatusRequestDto,
} from '../dto';
import { Subscriber } from '../model';

export interface ISubscriptionRepository {
  createSubscriber(data: CreateSubscriberRequestDto): Promise<Subscriber>;

  updateSubscriberStatus(
    data: UpdateSubscriberStatusRequestDto,
  ): Promise<Subscriber>;
}
