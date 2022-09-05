import { Test, TestingModule } from '@nestjs/testing';
import { LocalDbName } from '../../../common/constants';
import { LocalDbModule } from '../../../database/local-db/local-db.module';
import { LocalDbService } from '../../../database/local-db/local-db.service';
import { ExchangeApiModule } from '../../../exchange-api/exchange-api.module';
import { ExchangeApiService } from '../../../exchange-api/exchange-api.service';
import { MailModule } from '../../../mail/mail.module';
import { MailService } from '../../../mail/mail.service';
import {
  exchangeApiRequest,
  exchangeApiResponse,
  exchangeMap,
  subscriptionEmail,
  emailList,
} from '../../../test/mock-data';
import { SubscriptionMapper } from '../../map';
import { SubscriptionService } from '../subscription.service';

describe('Subscription Service', () => {
  let subscriptionService: SubscriptionService;

  const mockedDbService = {
    addOne: jest.fn(),
    findAll: jest.fn(),
  };

  const mockedMailService = {
    sendExchangeRateEmail: jest.fn(),
  };

  const mockedExchangeApiService = {
    getCurrencyConversion: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [LocalDbModule, MailModule, ExchangeApiModule],
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
          useValue: mockedExchangeApiService,
        },
      ],
    }).compile();

    subscriptionService =
      moduleRef.get<SubscriptionService>(SubscriptionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('All dependencies should be defined', () => {
    it('should be defined', () => {
      expect(subscriptionService).toBeDefined();
      expect(mockedDbService).toBeDefined();
      expect(mockedMailService).toBeDefined();
      expect(mockedExchangeApiService).toBeDefined();
    });
  });

  describe('addNewEmail method', () => {
    const { ok: email } = subscriptionEmail;

    describe('addNewEmail method normal operation', () => {
      beforeEach(async () => {
        jest.spyOn(mockedDbService, 'addOne').mockResolvedValue(email);
      });

      it('should return value', async () => {
        await subscriptionService.addNewEmail(email);

        expect(mockedDbService.addOne).toHaveBeenCalled();
        expect(mockedDbService.addOne).toHaveBeenCalledWith(
          LocalDbName.Email,
          email,
        );
        expect(await mockedDbService.addOne(LocalDbName.Email, email)).toEqual(
          email,
        );
        expect(await subscriptionService.addNewEmail(email)).toBe(email);
      });
    });

    describe('addNewEmail method with error', () => {
      beforeEach(async () => {
        jest.spyOn(mockedDbService, 'addOne').mockResolvedValue(null);
      });

      it('should return null', async () => {
        await subscriptionService.addNewEmail(email);

        expect(mockedDbService.addOne).toHaveBeenCalled();
        expect(mockedDbService.addOne).toHaveBeenCalledWith(
          LocalDbName.Email,
          email,
        );
        expect(
          await mockedDbService.addOne(LocalDbName.Email, email),
        ).toBeNull();
        expect(await subscriptionService.addNewEmail(email)).toBeNull();
      });
    });
  });

  describe('sendEmails method', () => {
    describe('sendEmails method normal operation', () => {
      beforeEach(async () => {
        jest.spyOn(mockedDbService, 'findAll').mockResolvedValue(emailList);
        jest
          .spyOn(mockedExchangeApiService, 'getCurrencyConversion')
          .mockResolvedValue(exchangeApiResponse);
        jest
          .spyOn(SubscriptionMapper, 'toSendEmailsDto')
          .mockReturnValue(exchangeMap);
      });

      it('should get all data & send emails', async () => {
        await subscriptionService.sendEmails();

        expect(mockedDbService.findAll).toHaveBeenCalled();
        expect(mockedDbService.findAll).toHaveBeenCalledWith(LocalDbName.Email);
        expect(await mockedDbService.findAll(LocalDbName.Email)).toEqual(
          emailList,
        );
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
        expect(mockedMailService.sendExchangeRateEmail).toHaveBeenCalled();
        expect(mockedMailService.sendExchangeRateEmail).toHaveBeenCalledWith(
          emailList[0],
          exchangeMap,
        );
        expect(mockedMailService.sendExchangeRateEmail).toHaveBeenCalledWith(
          emailList[2],
          exchangeMap,
        );
      });
    });

    describe('sendEmails method because of an empty DB', () => {
      beforeEach(async () => {
        jest.spyOn(mockedDbService, 'findAll').mockResolvedValue(null);
      });

      it('should return null', async () => {
        await subscriptionService.sendEmails();

        expect(mockedDbService.findAll).toHaveBeenCalled();
        expect(mockedDbService.findAll).toHaveBeenCalledWith(LocalDbName.Email);
        expect(await mockedDbService.findAll(LocalDbName.Email)).toBeNull();
        expect(
          mockedExchangeApiService.getCurrencyConversion,
        ).not.toHaveBeenCalled();
        expect(mockedMailService.sendExchangeRateEmail).not.toHaveBeenCalled();
        expect(await subscriptionService.sendEmails()).toBeNull();
      });
    });

    describe('sendEmails method because of API service returned null', () => {
      beforeEach(async () => {
        jest.spyOn(mockedDbService, 'findAll').mockResolvedValue(emailList);
        jest
          .spyOn(mockedExchangeApiService, 'getCurrencyConversion')
          .mockResolvedValue(null);
      });

      it('should return null', async () => {
        await subscriptionService.sendEmails();

        expect(mockedDbService.findAll).toHaveBeenCalled();
        expect(mockedDbService.findAll).toHaveBeenCalledWith(LocalDbName.Email);
        expect(await mockedDbService.findAll(LocalDbName.Email)).toEqual(
          emailList,
        );
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
        expect(mockedMailService.sendExchangeRateEmail).not.toHaveBeenCalled();
        expect(await subscriptionService.sendEmails()).toBeNull();
      });
    });
  });
});
