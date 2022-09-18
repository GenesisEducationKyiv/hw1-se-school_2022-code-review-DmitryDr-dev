import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType } from 'redis';
import { CachedExchangeApiService } from 'src/exchange-api/common/cached-service';
import { ExchangeApiCreator } from 'src/exchange-api/common/creator/exchange-api-creator';
import { IExchangeApiService } from 'src/exchange-api/common/service';
import { RedisClientToken } from 'src/redis/redis.module';
import { ExchangeRatesService } from '../service';

@Injectable()
export class ExchangeRatesCreator extends ExchangeApiCreator {
  constructor(
    @Inject(RedisClientToken) private readonly redisClient: RedisClientType,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  public createExchangeApi(): IExchangeApiService {
    const exchangeApi = new ExchangeRatesService(
      this.httpService,
      this.configService,
    );
    return new CachedExchangeApiService(exchangeApi, this.redisClient);
  }
}
