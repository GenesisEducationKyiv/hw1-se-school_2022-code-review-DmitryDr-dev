import {
  CreateSubscriberRequestDto,
  CreateSubscriberResponseDto,
  UpdateSubscriberStatusResponseDto,
} from '../dto';

export interface IStep {
  process(
    dto: CreateSubscriberRequestDto,
  ): Promise<CreateSubscriberResponseDto>;

  revert(
    dto: CreateSubscriberResponseDto,
  ): Promise<UpdateSubscriberStatusResponseDto>;
}
