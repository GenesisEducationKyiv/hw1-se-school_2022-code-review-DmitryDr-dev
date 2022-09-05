import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeApiModule } from '../../../exchange-api/exchange-api.module';
import { ExchangeApiService } from '../../../exchange-api/exchange-api.service';
import {
  exchangeApiResponse,
  exchangeApiRequest,
} from '../../../test/mock-data';
import { RateService } from '../rate.service';

describe('RateService', () => {
  let rateService: RateService;

  const mockedExchangeApiService = {
    getCurrencyConversion: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [ExchangeApiModule],
      providers: [
        RateService,
        {
          provide: ExchangeApiService,
          useValue: mockedExchangeApiService,
        },
      ],
    }).compile();

    rateService = moduleRef.get<RateService>(RateService);
  });

  describe('All dependencies should be defined', () => {
    it('should be defined', async () => {
      expect(rateService).toBeDefined();
      expect(mockedExchangeApiService).toBeDefined();
    });
  });

  describe('getBtcToUah method', () => {
    describe('getBtcToUah normal work', () => {
      beforeEach(async () => {
        jest
          .spyOn(mockedExchangeApiService, 'getCurrencyConversion')
          .mockResolvedValue(exchangeApiResponse);
      });

      it('should return a value', async () => {
        await rateService.getBtcToUah();

        expect(
          mockedExchangeApiService.getCurrencyConversion,
        ).toHaveBeenCalled();
        expect(
          mockedExchangeApiService.getCurrencyConversion,
        ).toHaveBeenCalledWith(exchangeApiRequest.from, exchangeApiRequest.to);
        expect(
          await mockedExchangeApiService.getCurrencyConversion(
            exchangeApiRequest.from,
            exchangeApiRequest.to,
          ),
        ).toEqual(exchangeApiResponse);
        expect(await rateService.getBtcToUah()).toBe(
          exchangeApiResponse.info.rate,
        );
      });
    });

    describe('getBtcToUah error processing', () => {
      beforeEach(async () => {
        jest
          .spyOn(mockedExchangeApiService, 'getCurrencyConversion')
          .mockResolvedValue(null);
      });

      it('should return null', async () => {
        await rateService.getBtcToUah();

        expect(
          mockedExchangeApiService.getCurrencyConversion,
        ).toHaveBeenCalled();
        expect(
          mockedExchangeApiService.getCurrencyConversion,
        ).toHaveBeenCalledWith(exchangeApiRequest.from, exchangeApiRequest.to);
        expect(
          await mockedExchangeApiService.getCurrencyConversion(
            exchangeApiRequest.from,
            exchangeApiRequest.to,
          ),
        ).toBeNull();
        expect(await rateService.getBtcToUah()).toBeNull();
      });
    });
  });
});
