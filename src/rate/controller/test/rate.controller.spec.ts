import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { exchangeApiResponse } from '../../../test/mock-data';
import { RateService } from '../../service';
import { RateController } from '../rate.controller';

describe('RateController', () => {
  let rateController: RateController;

  const mockedRateService = {
    getBtcToUah: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [RateController],
      providers: [
        {
          provide: RateService,
          useValue: mockedRateService,
        },
      ],
    }).compile();

    rateController = moduleRef.get<RateController>(RateController);
  });

  describe('All dependencies should be defined', () => {
    it('should be defined', async () => {
      expect(rateController).toBeDefined();
      expect(mockedRateService).toBeDefined();
    });
  });

  describe('getExchangeRate method', () => {
    describe('getExchangeRate method normal work', () => {
      const result = exchangeApiResponse.info.rate;

      beforeEach(async () => {
        jest.spyOn(mockedRateService, 'getBtcToUah').mockResolvedValue(result);
      });

      it('should return a value', async () => {
        await rateController.getExchangeRate();

        expect(mockedRateService.getBtcToUah).toHaveBeenCalled();
        expect(await rateController.getExchangeRate()).toBe(result);
        expect(typeof result).toBe('number');
      });
    });

    describe('getExchangeRate method with BadRequestException', () => {
      const result = null;

      beforeEach(async () => {
        jest.spyOn(mockedRateService, 'getBtcToUah').mockResolvedValue(result);
      });

      it('should throw BadRequestException', async () => {
        await expect(rateController.getExchangeRate()).rejects.toThrowError(
          BadRequestException,
        );
      });
    });
  });
});
