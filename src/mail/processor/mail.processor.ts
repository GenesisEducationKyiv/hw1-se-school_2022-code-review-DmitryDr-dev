import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import * as path from 'path';
import { SentMessageInfo } from 'nodemailer';
import { IMailProcessor } from './mail.processor.interface';
import { IExchangeApiResponse } from '../../exchange-api/common/interfaces';

@Injectable()
@Processor('mailQueue')
export class MailProcessor implements IMailProcessor {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private mailerService: MailerService) {}

  @Process('sendExchangeRateEmail')
  public async sendExchangeRateEmail(
    job: Job<{ email: string; exchangeRateData: IExchangeApiResponse }>,
  ): Promise<SentMessageInfo> {
    const {
      email,
      exchangeRateData: {
        sourceAmount,
        sourceCurrency,
        targetAmount,
        targetCurrency,
      },
    } = job.data;

    try {
      this.logger.log(`Sending exchange rate email to ${email}`);
      const result: Promise<SentMessageInfo> =
        await this.mailerService.sendMail({
          to: email,
          subject: 'Exchange Rate',
          template: path.join('./exchange-rate'),
          context: {
            sourceAmount,
            sourceCurrency,
            targetAmount,
            targetCurrency,
          },
        });

      return await result;
    } catch (error) {
      throw new Error(`Error occurred while sending email: ${error.message}`);
    }
  }
}
