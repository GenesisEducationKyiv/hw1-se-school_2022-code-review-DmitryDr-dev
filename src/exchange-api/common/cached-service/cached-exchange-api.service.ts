import { ConfigService } from '@nestjs/config';
import { RedisClientType } from 'redis';
import { IExchangeApiRequest, IExchangeApiResponse } from '../interfaces';
import { IExchangeApiService } from '../service';

export class CachedExchangeApiService implements IExchangeApiService {
  private exchangeApi: IExchangeApiService;

  private redisClient: RedisClientType;

  private configService: ConfigService;

  constructor(
    exchangeApi: IExchangeApiService,
    redisClient: RedisClientType,
    configService: ConfigService,
  ) {
    this.exchangeApi = exchangeApi;
    this.redisClient = redisClient;
    this.configService = configService;
  }

  get nextHandler(): IExchangeApiService {
    return this.exchangeApi.nextHandler;
  }

  public setNext(handler: IExchangeApiService): IExchangeApiService {
    return this.exchangeApi.setNext(handler);
  }

  public async getExchangeRate(request: IExchangeApiRequest): Promise<number> {
    try {
      const key = `${this.constructor.name}-${this.getExchangeRate.name}`;

      const cache = await this.getCacheData(key);
      if (cache) return parseFloat(cache);

      const result = await this.exchangeApi.getExchangeRate(request);
      await this.setCacheData(key, result.toString());

      return result;
    } catch (error) {
      throw new Error(`Error while fetching data: ${error.message}`);
    }
  }

  public async getExchangeRateData(
    request: IExchangeApiRequest,
  ): Promise<IExchangeApiResponse> {
    try {
      const key = `${this.constructor.name}-${this.getExchangeRateData.name}`;

      const cache = await this.getCacheData(key);
      if (cache) return JSON.parse(cache);

      const result = await this.exchangeApi.getExchangeRateData(request);
      await this.setCacheData(key, JSON.stringify(result));

      return result;
    } catch (error) {
      throw new Error(`Error while fetching data: ${error.message}`);
    }
  }

  private async getCacheData(key: string): Promise<string> {
    const result = await this.redisClient.get(key);
    return result;
  }

  private async setCacheData(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value, {
      EX: this.configService.get<number>('REDIS_CACHE_EXPIRATION_IN_SEC'),
    });
  }
}
