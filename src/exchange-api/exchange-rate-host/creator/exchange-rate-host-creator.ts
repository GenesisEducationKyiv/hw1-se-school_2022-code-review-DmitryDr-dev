import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType } from 'redis';
import { IExchangeApiCreator } from 'src/exchange-api/common/creator';
import { IEventDispatcher } from '../../../event/event-dispatcher/interface';
import { EventDispatcherToken } from '../../../event/event.module';
import { RedisClientToken } from '../../../redis/redis.module';
import { CachedExchangeApiService } from '../../common/cached-service';
import { IExchangeApiService } from '../../common/service';
import { ExchangeRateHostService } from '../services';

@Injectable({ scope: Scope.REQUEST })
export class ExchangeRateHostCreator implements IExchangeApiCreator {
  constructor(
    @Inject(RedisClientToken) private readonly redisClient: RedisClientType,
    @Inject(EventDispatcherToken)
    private readonly eventDispatcher: IEventDispatcher,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  public createExchangeApi(): IExchangeApiService {
    const exchangeApi = new ExchangeRateHostService(
      this.httpService,
      this.eventDispatcher,
    );

    return new CachedExchangeApiService(
      exchangeApi,
      this.redisClient,
      this.configService,
    );
  }
}
