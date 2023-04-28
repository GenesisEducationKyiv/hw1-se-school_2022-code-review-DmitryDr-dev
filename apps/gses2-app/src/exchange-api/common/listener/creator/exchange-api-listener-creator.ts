import { Injectable } from '@nestjs/common';
import { ExchangeApiListenerService } from '../service';
import { IExchangeApiListenerCreator } from './exchange-api-listener-creator.interface';

@Injectable()
export class ExchangeApiListenerCreator implements IExchangeApiListenerCreator {
  public createListener(): ExchangeApiListenerService {
    const exchangeApiListener = new ExchangeApiListenerService('exchange-api');
    return exchangeApiListener;
  }
}
