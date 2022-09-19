import { ExchangeApiListenerService } from '../service';

export interface IExchangeApiListenerCreator {
  createListener(): ExchangeApiListenerService;
}
