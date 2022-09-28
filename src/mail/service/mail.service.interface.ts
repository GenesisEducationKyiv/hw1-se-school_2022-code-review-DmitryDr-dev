import { SentMessageInfo } from 'nodemailer';
import { IExchangeApiResponse } from '../../exchange-api/common/interfaces';

export interface IMailService {
  sendExchangeRateEmail: (
    email: string,
    exchangeRateData: IExchangeApiResponse,
  ) => Promise<SentMessageInfo>;
}
