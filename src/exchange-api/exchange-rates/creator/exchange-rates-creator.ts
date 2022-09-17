import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExchangeApiCreator } from 'src/exchange-api/common/creator/exchange-api-creator';
import { IExchangeApiService } from 'src/exchange-api/common/service';
import { ExchangeRatesService } from '../service';

@Injectable()
export class ExchangeRatesCreator extends ExchangeApiCreator {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  public createExchangeApi(): IExchangeApiService {
    return new ExchangeRatesService(this.httpService, this.configService);
  }
}
