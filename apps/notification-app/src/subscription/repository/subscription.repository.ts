import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateSubscriberRequestDto,
  UpdateSubscriberStatusRequestDto,
} from '../dto';
import { Subscriber } from '../model';
import { ISubscriptionRepository } from './subscription.repository.interface';

@Injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
  constructor(
    @InjectModel(Subscriber)
    private readonly subscriberModel: typeof Subscriber,
  ) {}

  public async createSubscriber(
    data: CreateSubscriberRequestDto,
  ): Promise<Subscriber> {
    try {
      const subscriber = await this.subscriberModel.create(data);

      return subscriber;
    } catch (error) {
      throw new Error(
        `Error occurred while creating new subscriber: ${error.message}`,
      );
    }
  }

  public async updateSubscriberStatus(
    data: UpdateSubscriberStatusRequestDto,
  ): Promise<Subscriber> {
    try {
      const subscriber = await this.subscriberModel.findByPk(data.id);

      if (!subscriber) throw new Error(`Subscriber with ${data.id} not found`);

      subscriber.status = data.status;
      await subscriber.save();

      return subscriber;
    } catch (error) {
      throw new Error(
        `Error occurred while updating subscriber status: ${error.message}`,
      );
    }
  }
}
