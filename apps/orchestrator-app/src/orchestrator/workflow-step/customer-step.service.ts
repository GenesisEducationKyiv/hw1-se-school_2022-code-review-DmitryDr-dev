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
export class CustomerStep implements IStep {
  constructor(
    @Inject(DI_TOKEN.CustomerRbqToken)
    private readonly customerClient: ClientProxy,
  ) {}

  public async process(
    dto: CreateSubscriberRequestDto,
  ): Promise<CreateSubscriberResponseDto> {
    try {
      const notificationRes = this.customerClient.send('create-customer', dto);
      const customer = await lastValueFrom(notificationRes);

      return customer;
    } catch (error) {
      throw new Error(`Error occurred on creating customer: ${error.message}`);
    }
  }

  public async revert(
    dto: CreateSubscriberResponseDto,
  ): Promise<UpdateSubscriberStatusResponseDto> {
    try {
      const notificationRes = this.customerClient.send('create-customer', dto);
      const customer = await lastValueFrom(notificationRes);

      return customer;
    } catch (error) {
      throw new Error(`Error occurred on creating customer: ${error.message}`);
    }
  }
}
