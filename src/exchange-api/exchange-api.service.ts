import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ExchangeApiService {
  private readonly logger = new Logger(ExchangeApiService.name);

  constructor(private readonly httpService: HttpService) {}

  public async getCurrencyConversion(from: string, to: string, amount = 1) {
    const data = await lastValueFrom(
      this.httpService
        .get(
          `https://api.apilayer.com/exchangerates_data/convert?to=${to}&from=${from}&amount=${amount}`,
          {
            headers: {
              apikey: `${process.env.EXCHANGE_API_KEY}`,
            },
          },
        )
        .pipe(
          map((result) => result.data),
          catchError((error) => {
            this.logger.error(error.message);
            throw new BadRequestException();
          }),
        ),
    );

    return data;
  }
}
