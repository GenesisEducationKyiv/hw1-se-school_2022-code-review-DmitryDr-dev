import { Injectable, Logger } from '@nestjs/common';
import { LocalDbName } from '../common/constants';
import { LocalDbService } from '../database/local-db/local-db.service';
import { ExchangeApiService } from '../exchange-api/exchange-api.service';
import { MailService } from '../mail/mail.service';
import { IExchangeRate } from './interfaces';
import { SubscriptionMapper } from './map';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(
    private localDbService: LocalDbService,
    private mailService: MailService,
    private exchangeApiService: ExchangeApiService,
  ) {}

  public async addNewEmail(email: string) {
    try {
      return await this.localDbService.addOne(LocalDbName.Email, email);
    } catch (error) {
      this.logger.error(
        `Error occurred while creating new contact': ${error.message}`,
      );

      return null;
    }
  }

  public async sendEmails() {
    try {
      const emails = await this.localDbService.findAll(LocalDbName.Email);

      if (!emails) return null;

      const exchangeRate = await this.exchangeApiService.getCurrencyConversion(
        'BTC',
        'UAH',
      );

      if (!exchangeRate) return null;

      const exchangeMap: IExchangeRate =
        SubscriptionMapper.toSendEmailsDto(exchangeRate);
      const allPromises = emails.map(
        (email) =>
          new Promise((res, rej) => {
            this.mailService
              .sendExchangeRateEmail(email as string, exchangeMap)
              .then(() => {
                res(email);
              })
              .catch(() => {
                rej(email);
              });
          }),
      );
      return await Promise.allSettled(allPromises);
    } catch (error) {
      this.logger.error(
        `Error occurred while sending emails: ${error.message}`,
      );

      return null;
    }
  }
}
