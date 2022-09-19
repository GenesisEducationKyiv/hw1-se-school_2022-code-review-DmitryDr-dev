import { Inject, Injectable } from '@nestjs/common';
import { IExchangeApiService } from '../../exchange-api/common/service';
import { ICreatorPool } from '../../exchange-api/creator-pool';
import { ICreatorPoolToken } from '../../exchange-api/exchange-api.module';
import { IMailServiceToken } from '../../mail/mail.module';
import { IMailService } from '../../mail/service';
import { SubscriptionRepository } from '../repository';
import { ISubscriptionService } from './subscription.service.interface';

@Injectable()
export class SubscriptionService implements ISubscriptionService {
  private exchangeApi: IExchangeApiService;

  constructor(
    @Inject(ICreatorPoolToken) private readonly creatorTool: ICreatorPool,
    @Inject(IMailServiceToken)
    private readonly mailService: IMailService,
    private subscriptionRepository: SubscriptionRepository,
  ) {
    this.exchangeApi = this.creatorTool.getExchangeApi();
  }

  public async addNewEmail(email: string): Promise<string> {
    try {
      const result = await this.subscriptionRepository.addOne(email);

      return result;
    } catch (error) {
      throw new Error(
        `Error occurred while creating new contact: ${error.message}`,
      );
    }
  }

  public async sendEmails(): Promise<PromiseSettledResult<unknown>[]> {
    try {
      const emails = await this.subscriptionRepository.findAll();

      if (emails.length === 0) throw new Error('Email list is empty');

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
