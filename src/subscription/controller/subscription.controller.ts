import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UseFilters,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../../common/filters';
import { SubscribeEmailDto } from '../dto';
import { SubscriptionService } from '../service';

@Controller()
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Post('subscribe')
  @HttpCode(200)
  @UseFilters(new HttpExceptionFilter())
  public async subscribeEmail(@Body() body: SubscribeEmailDto) {
    const result = await this.subscriptionService.addNewEmail(body.email);

    if (!result) throw new BadRequestException();

    return result;
  }

  @Post('sendEmails')
  @HttpCode(200)
  @UseFilters(new HttpExceptionFilter())
  async sendEmails() {
    const result = await this.subscriptionService.sendEmails();

    return result;
  }
}
