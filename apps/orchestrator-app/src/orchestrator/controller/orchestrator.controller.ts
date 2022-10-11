import { Controller } from '@nestjs/common';
import { EventPattern, RpcException } from '@nestjs/microservices';
import {
  CreateSubscriberRequestDto,
  CreateSubscriberResponseDto,
} from '../dto';
import { OrchestratorService } from '../service';

@Controller()
export class OrchestratorController {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  @EventPattern('orchestrator-create-subscriber')
  public async createSubscriber(
    dto: CreateSubscriberRequestDto,
  ): Promise<CreateSubscriberResponseDto> {
    try {
      const subscriber = await this.orchestratorService.createSubscriber(dto);
      return subscriber;
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
