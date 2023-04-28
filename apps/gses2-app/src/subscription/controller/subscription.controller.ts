import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { SubscribeEmailDto } from '../dto';
import { SubscriptionService } from '../service';

@Controller()
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Post('subscribe')
  @HttpCode(200)
  public async subscribeEmail(@Body() body: SubscribeEmailDto): Promise<void> {
    try {
      await this.subscriptionService.addNewEmail(body.email);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Post('sendEmails')
  @HttpCode(200)
  async sendEmails(): Promise<PromiseSettledResult<unknown>[]> {
    try {
      const result = await this.subscriptionService.sendEmails();

      return result;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
