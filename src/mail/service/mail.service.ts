import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { SentMessageInfo } from 'nodemailer';
import { IExchangeApiResponse } from '../../exchange-api/common/interfaces';
import { IMailService } from './mail.service.interface';

@Injectable()
export class MailService implements IMailService {
  private readonly logger = new Logger(MailService.name);

  constructor(@InjectQueue('mailQueue') private readonly mailQueue: Queue) {}

  public async sendExchangeRateEmail(
    email: string,
    exchangeRateData: IExchangeApiResponse,
  ): Promise<SentMessageInfo> {
    try {
      const job = await this.mailQueue.add('sendExchangeRateEmail', {
        email,
        exchangeRateData,
      });

      const result: Promise<SentMessageInfo> = await job.finished();

      return await result;
    } catch (error) {
      throw new Error(
        `Error occurred while sending email to ${email} because of ${error.message}`,
      );
    }
  }
}
