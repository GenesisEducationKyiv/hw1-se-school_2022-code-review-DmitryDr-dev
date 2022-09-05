import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import * as path from 'path';
import { IExchangeRate } from 'src/subscription/interfaces';

@Injectable()
@Processor('mailQueue')
export class MailProcessor {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private mailerService: MailerService) {}

  @Process('sendExchangeRateEmail')
  public async sendExchangeRateEmail(
    job: Job<{ email: string; exchangeRateData: IExchangeRate }>,
  ) {
    const {
      email,
      exchangeRateData: {
        sourceAmount,
        sourceCurrency,
        targetAmount,
        targetCurrency,
      },
    } = job.data;

    this.logger.log(`Sending exchange rate email to ${email}`);
    try {
      const result = await this.mailerService.sendMail({
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

      return result;
    } catch (error) {
      this.logger.error(`Error occurred while sending email: ${error.message}`);

      return null;
    }
  }
}
