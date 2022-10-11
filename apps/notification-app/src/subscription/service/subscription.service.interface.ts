import {
  CreateSubscriberRequestDto,
  CreateSubscriberResponseDto,
  UpdateSubscriberStatusRequestDto,
  UpdateSubscriberStatusResponseDto,
} from '../dto';

export interface ISubscriptionService {
  createSubscriber(
    data: CreateSubscriberRequestDto,
  ): Promise<CreateSubscriberResponseDto>;

  updateSubscriberStatus(
    data: UpdateSubscriberStatusRequestDto,
  ): Promise<UpdateSubscriberStatusResponseDto>;
}
