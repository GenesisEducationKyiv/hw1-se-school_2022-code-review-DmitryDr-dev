import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ExchangeApiCreator } from 'src/exchange-api/common/creator/exchange-api-creator';
import { IExchangeApiService } from 'src/exchange-api/common/service';
import { CurrencyApiService } from '../service';

@Injectable()
export class CurrencyApiCreator extends ExchangeApiCreator {
  constructor(private readonly httpService: HttpService) {
    super();
  }

  public createExchangeApi(): IExchangeApiService {
    return new CurrencyApiService(this.httpService);
  }
}
