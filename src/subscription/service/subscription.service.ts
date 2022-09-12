import { Inject, Injectable } from '@nestjs/common';
import { LocalDbName } from '../../common/constants';
import { IExchangeApiServiceToken } from '../../exchange-api/exchange-api.module';
import { IExchangeApiService } from '../../exchange-api/common/service';
import { ISubscriptionService } from './subscription.service.interface';
import { ILocalDbServiceToken } from '../../database/local-db/local-db.module';
import { ILocalDbService } from '../../database/local-db/service';
import { IMailServiceToken } from '../../mail/mail.module';
import { IMailService } from '../../mail/service';

@Injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @Inject(ILocalDbServiceToken)
    private readonly localDbService: ILocalDbService,
    @Inject(IExchangeApiServiceToken)
    private readonly exchangeApi: IExchangeApiService,
    @Inject(IMailServiceToken)
    private readonly mailService: IMailService,
  ) {}

  public async addNewEmail(email: string): Promise<string> {
    try {
      const result = await this.localDbService.addOne(LocalDbName.Email, email);

      return result;
    } catch (error) {
      throw new Error(
        `Error occurred while creating new contact': ${error.message}`,
      );
    }
  }

  public async sendEmails(): Promise<PromiseSettledResult<unknown>[]> {
    try {
      const emails: Array<string> = await this.localDbService.findAll(
        LocalDbName.Email,
      );
      const exchangeRate = await this.exchangeApi.getExchangeRateData({
        sourceCurrency: 'BTC',
        targetCurrency: 'UAH',
        amount: 1,
      });

      const allPromises = emails.map(
        (email) =>
          new Promise((res, rej) => {
            this.mailService
              .sendExchangeRateEmail(email, exchangeRate)
              .then(() => {
                res(email);
              })
              .catch(() => {
                rej(email);
              });
          }),
      );
      const result: PromiseSettledResult<unknown>[] = await Promise.allSettled(
        allPromises,
      );

      return result;
    } catch (error) {
      throw new Error(`Error occurred while sending emails': ${error.message}`);
    }
  }
}
