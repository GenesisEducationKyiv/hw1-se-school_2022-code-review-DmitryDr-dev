import { Inject, Injectable, Scope } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { DI_TOKEN } from '../../common/constants';
import {
  CreateSubscriberRequestDto,
  CreateSubscriberResponseDto,
  UpdateSubscriberStatusResponseDto,
} from '../dto';
import { IStep } from './workflow-step.interface';

@Injectable({ scope: Scope.REQUEST })
export class NotificationStep implements IStep {
  constructor(
    @Inject(DI_TOKEN.NotificationRbqToken)
    private readonly notificationClient: ClientProxy,
  ) {}

  public async process(
    dto: CreateSubscriberRequestDto,
  ): Promise<CreateSubscriberResponseDto> {
    try {
      const notificationRes = this.notificationClient.send(
        'create-subscriber',
        dto,
      );
      const subscriber = await lastValueFrom(notificationRes);

      return subscriber;
    } catch (error) {
      throw new Error(
        `Error occurred on creating subscriber: ${error.message}`,
      );
    }
  }

  public async revert(
    dto: CreateSubscriberResponseDto,
  ): Promise<UpdateSubscriberStatusResponseDto> {
    try {
      const notificationRes = this.notificationClient.send(
        'create-subscriber',
        dto,
      );
      const subscriber = await lastValueFrom(notificationRes);

      return subscriber;
    } catch (error) {
      throw new Error(
        `Error occurred on creating subscriber: ${error.message}`,
      );
    }
  }
}
