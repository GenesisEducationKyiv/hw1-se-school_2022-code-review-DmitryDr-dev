import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { CachedExchangeApiService } from 'src/exchange-api/common/cached-service/';
import { ExchangeApiCreator } from 'src/exchange-api/common/creator/exchange-api-creator';
import { IExchangeApiService } from 'src/exchange-api/common/service';
import { RedisClientToken } from 'src/redis/redis.module';
import { CurrencyApiService } from '../service';

@Injectable()
export class CurrencyApiCreator extends ExchangeApiCreator {
  constructor(
    @Inject(RedisClientToken) private readonly redisClient: RedisClientType,
    private readonly httpService: HttpService,
  ) {
    super();
  }

  public createExchangeApi(): IExchangeApiService {
    const exchangeApi = new CurrencyApiService(this.httpService);
    return new CachedExchangeApiService(exchangeApi, this.redisClient);
  }
}
