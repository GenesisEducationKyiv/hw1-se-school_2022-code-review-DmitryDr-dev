import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { RpcException } from '@nestjs/microservices';
import {
  CreateSubscriberRequestDto,
  CreateSubscriberResponseDto,
} from '../dto';
import { IStep } from '../workflow-step';
import { subscribeOrchestratorSteps } from '../workflow-step/orchestrator-step';

interface IStepResult {
  operationStatus: string;
  operationResult: CreateSubscriberResponseDto;
}

@Injectable()
export class OrchestratorService {
  constructor(private readonly moduleRef: ModuleRef) {}

  public async createSubscriber(
    dto: CreateSubscriberRequestDto,
  ): Promise<CreateSubscriberResponseDto> {
    const map = new Map<IStep, IStepResult>();
    const steps = Object.entries(subscribeOrchestratorSteps);
    let subscriber: CreateSubscriberResponseDto;

    try {
      for (let i = 0; i < steps.length; i += 1) {
        const [name, stepEntity] = steps[i];
        /* eslint-disable no-await-in-loop */
        const step = await this.moduleRef.resolve(stepEntity);
        const result = await step.process(dto);
        map.set(step, {
          operationStatus: 'success',
          operationResult: result,
        });
        /* eslint-enable no-await-in-loop */

        if (name === 'notificationStep') {
          subscriber = result;
        }
      }

      return subscriber;
    } catch (error) {
      await this.disableSubscriber(map);
      throw new RpcException(error.message);
    }
  }

  public async disableSubscriber(map: Map<IStep, IStepResult>): Promise<void> {
    try {
      /* eslint-disable no-restricted-syntax */
      for (const entry of map) {
        const [step, stepResult] = entry;
        /* eslint-disable no-await-in-loop */
        await step.revert(stepResult.operationResult);
        /* eslint-enable no-await-in-loop */
      }
      /* eslint-enable no-restricted-syntax */
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
