import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { ValidationPipe } from '../../../common/pipes';
import { RateController } from '../index';
import { RateService } from '../../service';
import { IExchangeApiServiceToken } from '../../../exchange-api/exchange-api.module';
import { exchangeRatesResponse } from '../../../test/mock-data/exchange-rates-response';

describe('Rate Module', () => {
  let app: INestApplication;

  const mockedExchangeApiService = {
    getExchangeRate: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [RateController],
      providers: [
        RateService,
        {
          provide: IExchangeApiServiceToken,
          useValue: mockedExchangeApiService,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('GET gses2.app/api/rate', () => {
    describe('GET gses2.app/api/rate returns value', () => {
      beforeEach(async () => {
        jest
          .spyOn(mockedExchangeApiService, 'getExchangeRate')
          .mockResolvedValue(exchangeRatesResponse.result);
      });

      it('should return a value', () => {
        return request(app.getHttpServer())
          .get('/rate')
          .expect(200)
          .expect(`${exchangeRatesResponse.result}`);
      });
    });

    describe('GET gses2.app/api/rate throws Error', () => {
      beforeEach(async () => {
        mockedExchangeApiService.getExchangeRate.mockImplementation(() => {
          throw new Error();
        });
      });

      it('should throw BadRequestException', () => {
        return request(app.getHttpServer()).get('/rate').expect(400);
      });
    });
  });
});
