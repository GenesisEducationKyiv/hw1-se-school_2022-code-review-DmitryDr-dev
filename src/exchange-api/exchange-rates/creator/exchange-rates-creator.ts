import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType } from 'redis';
import { IEventDispatcher } from '../../../event/event-dispatcher/interface';
import { EventDispatcherToken } from '../../../event/event.module';
import { RedisClientToken } from '../../../redis/redis.module';
import { CachedExchangeApiService } from '../../common/cached-service';
import { ExchangeApiCreator } from '../../common/creator/exchange-api-creator';
import { IExchangeApiService } from '../../common/service';
import { ExchangeRatesService } from '../service';

@Injectable()
export class ExchangeRatesCreator extends ExchangeApiCreator {
  constructor(
    @Inject(RedisClientToken) private readonly redisClient: RedisClientType,
    @Inject(EventDispatcherToken)
    private readonly eventDispatcher: IEventDispatcher,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  public createExchangeApi(): IExchangeApiService {
    const exchangeApi = new ExchangeRatesService(
      this.httpService,
      this.configService,
      this.eventDispatcher,
    );
    return new CachedExchangeApiService(
      exchangeApi,
      this.redisClient,
      this.configService,
    );
  }
}
