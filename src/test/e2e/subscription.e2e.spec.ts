import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { ValidationPipe } from '../../common/pipes';
import { LocalDbService } from '../../database/local-db/local-db.service';
import { ExchangeApiService } from '../../exchange-api/exchange-api.service';
import { MailService } from '../../mail/mail.service';
import { SubscriptionController } from '../../subscription/controller';
import { SubscriptionService } from '../../subscription/service';
import { subscriptionEmail } from '../mock-data';

describe('Subscription Module', () => {
  let app: INestApplication;

  const mockedDbService = {
    addOne: jest.fn(),
    findAll: jest.fn(),
  };

  const mockedMailService = {};

  const mockedExchangeService = {};

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionController],
      providers: [
        SubscriptionService,
        {
          provide: LocalDbService,
          useValue: mockedDbService,
        },
        {
          provide: MailService,
          useValue: mockedMailService,
        },
        {
          provide: ExchangeApiService,
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

  afterEach(async () => {
    jest.clearAllMocks();
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
        jest.spyOn(mockedDbService, 'addOne').mockResolvedValue(null);
      });

      it('should return status 400', () => {
        return request(app.getHttpServer())
          .post('/subscribe')
          .send(`email=${validEmail}`)
          .expect(400);
      });
    });
  });

  describe('POST gses2.app/api/subscribe', () => {
    describe('should send emails to saved contacts in DB', () => {
      it('should return status 200', () => {
        return request(app.getHttpServer()).post('/sendEmails').expect(200);
      });
    });
  });
});
