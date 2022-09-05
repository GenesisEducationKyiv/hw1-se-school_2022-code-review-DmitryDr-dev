import { IExchangeRateApiResponse } from '../../exchange-api/interfaces';
import { IExchangeRate } from '../interfaces';

export class SubscriptionMapper {
  public static toSendEmailsDto(
    exchangeRate: IExchangeRateApiResponse,
  ): IExchangeRate {
    return {
      sourceCurrency: exchangeRate.query.from,
      targetCurrency: exchangeRate.query.to,
      sourceAmount: exchangeRate.query.amount,
      targetAmount: exchangeRate.info.rate,
    };
  }
}
