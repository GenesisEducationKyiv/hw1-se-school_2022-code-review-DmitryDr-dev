import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { ValidationPipe } from '../../../common/pipes';
import { SubscriptionController } from '../index';
import { SubscriptionService } from '../../service';
import {
  emailList,
  exchangeApiResponse,
  subscriptionEmail,
} from '../../../test/mock-data';
import { ILocalDbServiceToken } from '../../../database/local-db/local-db.module';
import { IMailServiceToken } from '../../../mail/mail.module';
import { IExchangeApiServiceToken } from '../../../exchange-api/exchange-api.module';

describe('Subscription Module', () => {
  let app: INestApplication;

  const mockedDbService = {
    addOne: jest.fn(),
    findAll: jest.fn(),
  };

  const mockedMailService = {};

  const mockedExchangeService = {
    getExchangeRateData: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionController],
      providers: [
        SubscriptionService,
        {
          provide: ILocalDbServiceToken,
          useValue: mockedDbService,
        },
        {
          provide: IMailServiceToken,
          useValue: mockedMailService,
        },
        {
          provide: IExchangeApiServiceToken,
          useValue: mockedExchangeService,
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

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('POST gses2.app/api/subscribe', () => {
    describe('should send emails to saved contacts in DB', () => {
      beforeEach(async () => {
        jest.spyOn(mockedDbService, 'findAll').mockResolvedValue(emailList);
        jest
          .spyOn(mockedExchangeService, 'getExchangeRateData')
          .mockResolvedValue(exchangeApiResponse);
      });

      it('should return status 200', () => {
        return request(app.getHttpServer()).post('/sendEmails').expect(200);
      });
    });
  });

  describe('POST gses2.app/api/sendEmails', () => {
    const { ok: validEmail, bad: invalidEmail } = subscriptionEmail;

    describe('should add new email', () => {
      beforeEach(async () => {
        jest.spyOn(mockedDbService, 'addOne').mockResolvedValue(validEmail);
      });

      it('should return status 200', () => {
        return request(app.getHttpServer())
          .post('/subscribe')
          .send(`email=${validEmail}`)
          .expect(200);
      });
    });

    describe('should throw BadException Error because of invalid format', () => {
      it('should return status 400', () => {
        return request(app.getHttpServer())
          .post('/subscribe')
          .send(`email=${invalidEmail}`)
          .expect(400);
      });
    });

    describe('should throw BadException Error because of duplicate in DB', () => {
      beforeEach(async () => {
        mockedDbService.addOne.mockImplementation(() => {
          throw new Error();
        });
      });

      it('should return status 400', () => {
        return request(app.getHttpServer())
          .post('/subscribe')
          .send(`email=${validEmail}`)
          .expect(400);
      });
    });
  });
});
