import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { ValidationPipe } from '../../common/pipes';
import { ExchangeApiService } from '../../exchange-api/exchange-api.service';
import { RateController } from '../../rate/controller';
import { RateService } from '../../rate/service';
import { exchangeApiResponse } from '../mock-data';

describe('Rate Module', () => {
  let app: INestApplication;

  const mockedExchangeApiService = {
    getCurrencyConversion: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [RateController],
      providers: [
        RateService,
        {
          provide: ExchangeApiService,
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
          .spyOn(mockedExchangeApiService, 'getCurrencyConversion')
          .mockResolvedValue(exchangeApiResponse);
      });

      it('should return a value', () => {
        return request(app.getHttpServer())
          .get('/rate')
          .expect(200)
          .expect(`${exchangeApiResponse.result}`);
      });
    });

    describe('GET gses2.app/api/rate throws Error', () => {
      beforeEach(async () => {
        jest
          .spyOn(mockedExchangeApiService, 'getCurrencyConversion')
          .mockResolvedValue(null);
      });

      it('should throw BadRequestException', () => {
        return request(app.getHttpServer()).get('/rate').expect(400);
      });
    });
  });
});
