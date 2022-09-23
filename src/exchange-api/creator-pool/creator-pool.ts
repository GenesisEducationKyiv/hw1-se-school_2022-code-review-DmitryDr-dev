import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiName, Event } from '../../common/constants';
import { IEventDispatcher } from '../../event/event-dispatcher/interface';
import { EventDispatcherToken } from '../../event/event.module';
import { ExchangeApiListenerCreator } from '../common/listener/creator';
import { IExchangeApiService } from '../common/service';
import { CurrencyApiCreator } from '../currency-api/creator';
import { ExchangeRateHostCreator } from '../exchange-rate-host/creator';
import { ExchangeRatesCreator } from '../exchange-rates/creator';
import { ICreatorPool } from './creator-pool.interface';

interface ServiceMap {
  [key: string]: IExchangeApiService;
}

@Injectable()
export class CreatorPool implements ICreatorPool {
  private configValue: string;

  private map: ServiceMap;

  public primaryApi: IExchangeApiService;

  constructor(
    @Inject(EventDispatcherToken)
    private readonly eventDispatcher: IEventDispatcher,
    private readonly exchangeApiListenerCreator: ExchangeApiListenerCreator,
    private readonly configService: ConfigService,
    private exchangeRatesCreator: ExchangeRatesCreator,
    private exchangeRateHostCreator: ExchangeRateHostCreator,
    private currencyApiCreator: CurrencyApiCreator,
  ) {
    this.onInit();
  }

  private onInit(): void {
    this.configValue = this.configService.get<string>(
      'CRYPTO_CURRENCY_PROVIDER',
    );
    this.map = {};
    this.createServices();
    this.createChain();
    this.bindListeners();
  }

  private bindListeners(): void {
    const apiListener = this.exchangeApiListenerCreator.createListener();

    this.eventDispatcher.attach(apiListener, Event.ExchangeApiResponse);
  }

  private createServices(): void {
    this.map[ApiName.CurrencyApi] = this.currencyApiCreator.createExchangeApi();
    this.map[ApiName.ExchangeRateHost] =
      this.exchangeRateHostCreator.createExchangeApi();
    this.map[ApiName.ExchangeRates] =
      this.exchangeRatesCreator.createExchangeApi();
  }

  private createChain(): void {
    const serviceArr = Object.entries(this.map);
    const serviceKeys = Object.keys(this.map);
    const primaryKey = serviceKeys.includes(this.configValue)
      ? this.configValue
      : serviceArr[0][0];
    const offset = serviceKeys.indexOf(primaryKey);
    const [, primaryService] = serviceArr[offset];
    this.primaryApi = primaryService;

    for (let i = 0; i < serviceArr.length; i += 1) {
      const currentIdx = (i + offset) % serviceArr.length;
      const nextIdx = (currentIdx + 1) % serviceArr.length;
      const [, currentService] = serviceArr[currentIdx];
      const [, nextService] = serviceArr[nextIdx];

      if (nextService.nextHandler) return;

      currentService.setNext(nextService);
    }
  }

  public getExchangeApi(): IExchangeApiService {
    return this.primaryApi;
  }
}
