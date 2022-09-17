import { Inject, Injectable } from '@nestjs/common';
import { LocalDbName } from 'src/common/constants';
import { IExchangeApiService } from 'src/exchange-api/common/service';
import { ICreatorPool } from 'src/exchange-api/creator-pool';
import { ICreatorPoolToken } from 'src/exchange-api/exchange-api.module';
import { ILocalDbServiceToken } from '../../database/local-db/local-db.module';
import { ILocalDbService } from '../../database/local-db/service';
import { IMailServiceToken } from '../../mail/mail.module';
import { IMailService } from '../../mail/service';
import { ISubscriptionService } from './subscription.service.interface';

@Injectable()
export class SubscriptionService implements ISubscriptionService {
  private exchangeApi: IExchangeApiService;

  constructor(
    @Inject(ILocalDbServiceToken)
    private readonly localDbService: ILocalDbService,
    @Inject(ICreatorPoolToken) private readonly creatorTool: ICreatorPool,
    @Inject(IMailServiceToken)
    private readonly mailService: IMailService,
  ) {
    this.exchangeApi = this.creatorTool.getExchangeApi();
  }

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
