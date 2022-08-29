import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { IExchangeRate } from 'src/subscription/interfaces';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(@InjectQueue('mailQueue') private readonly mailQueue: Queue) {}

  public async sendExchangeRateEmail(
    email: string,
    exchangeRateData: IExchangeRate,
  ) {
    try {
      const result = await this.mailQueue.add('sendExchangeRateEmail', {
        email,
        exchangeRateData,
      });

      return result;
    } catch (error) {
      this.logger.error(
        `Error occurred while sending email to ${email} because of ${error.message}`,
      );
      return null;
    }
  }
}
