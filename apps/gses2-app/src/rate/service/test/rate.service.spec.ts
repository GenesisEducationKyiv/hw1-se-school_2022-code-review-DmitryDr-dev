import { Test, TestingModule } from '@nestjs/testing';
import {
  exchangeApiRequest,
  exchangeRatesResponse,
} from '../../../test/mock-data';
import { RateService } from '../rate.service';
import { IExchangeApiServiceToken } from '../../../exchange-api/exchange-api.module';

describe('RateService', () => {
  let rateService: RateService;

  const mockedExchangeApiService = {
    getExchangeRate: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        RateService,
        {
          provide: IExchangeApiServiceToken,
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
          .spyOn(mockedExchangeApiService, 'getExchangeRate')
          .mockResolvedValue(exchangeRatesResponse.result);
      });

      it('should return a value', async () => {
        await rateService.getBtcToUah();

        expect(mockedExchangeApiService.getExchangeRate).toHaveBeenCalled();
        expect(mockedExchangeApiService.getExchangeRate).toHaveBeenCalledWith(
          exchangeApiRequest,
        );
        expect(
          await mockedExchangeApiService.getExchangeRate(exchangeApiRequest),
        ).toBe(exchangeRatesResponse.result);
        expect(await rateService.getBtcToUah()).toBe(
          exchangeRatesResponse.result,
        );
      });
    });

    describe('getBtcToUah error processing', () => {
      beforeEach(async () => {
        mockedExchangeApiService.getExchangeRate.mockImplementation(() => {
          throw new Error();
        });
      });

      it('should throw error', async () => {
        await expect(rateService.getBtcToUah()).rejects.toThrowError();
      });
    });
  });
});
