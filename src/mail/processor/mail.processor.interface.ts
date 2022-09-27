import { Job } from 'bull';
import { SentMessageInfo } from 'nodemailer';
import { IExchangeApiResponse } from '../../exchange-api/common/interfaces';

export interface IMailProcessor {
  sendExchangeRateEmail(
    job: Job<{ email: string; exchangeRateData: IExchangeApiResponse }>,
  ): Promise<SentMessageInfo>;
}
