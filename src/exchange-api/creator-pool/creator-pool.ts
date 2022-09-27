import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { Event } from '../../common/constants';
import { IEventDispatcher } from '../../event/event-dispatcher/interface';
import { EventDispatcherToken } from '../../event/event.module';
import { ExchangeApiListenerCreator } from '../common/listener/creator';
import { IExchangeApiService } from '../common/service';
import { apiCreator } from '../exchange-api.module';
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
    private readonly moduleRef: ModuleRef,
  ) {
    this.onInit();
  }

  private async onInit(): Promise<void> {
    this.configValue = this.configService.get<string>(
      'CRYPTO_CURRENCY_PROVIDER',
    );
    this.map = {};

    await this.createServices();
    this.createChain();
    this.bindListeners();
  }

  private bindListeners() {
    const apiListener = this.exchangeApiListenerCreator.createListener();

    this.eventDispatcher.attach(apiListener, Event.ExchangeApiResponse);
  }

  private async createServices(): Promise<void> {
    const keys = Object.keys(apiCreator);

    for (let i = 0; i < keys.length; i += 1) {
      /* eslint-disable no-await-in-loop */
      const el = keys[i];
      const creator = await this.moduleRef.resolve(apiCreator.ExchangeRateHost);

      this.map[el] = creator.createExchangeApi();
      /* eslint-enable no-await-in-loop */
    }
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
