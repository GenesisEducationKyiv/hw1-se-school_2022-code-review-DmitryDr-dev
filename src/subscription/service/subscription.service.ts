import { Inject, Injectable, Logger } from '@nestjs/common';
import { LocalDbName } from '../../common/constants';
import { LocalDbService } from '../../database/local-db/service/local-db.service';
import { MailService } from '../../mail/service/mail.service';
import { IExchangeApiServiceToken } from '../../exchange-api/exchange-api.module';
import { IExchangeApiService } from '../../exchange-api/common/service';
import { ISubscriptionService } from './subscription.service.interface';

@Injectable()
export class SubscriptionService implements ISubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(
    @Inject(IExchangeApiServiceToken) private exchangeApi: IExchangeApiService,
    private localDbService: LocalDbService,
    private mailService: MailService,
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
              .sendExchangeRateEmail(email as string, exchangeRate)
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
