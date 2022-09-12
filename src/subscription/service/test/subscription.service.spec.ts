import { Test, TestingModule } from '@nestjs/testing';
import { LocalDbName } from '../../../common/constants';
import {
  ILocalDbServiceToken,
  LocalDbModule,
} from '../../../database/local-db/local-db.module';
import {
  ExchangeApiModule,
  IExchangeApiServiceToken,
} from '../../../exchange-api/exchange-api.module';
import { IMailServiceToken, MailModule } from '../../../mail/mail.module';
import {
  emailList,
  exchangeApiRequest,
  exchangeApiResponse,
  subscriptionEmail,
} from '../../../test/mock-data';
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
    getExchangeRateData: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [LocalDbModule, MailModule, ExchangeApiModule],
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
        mockedDbService.addOne.mockImplementation(() => {
          throw new Error();
        });
      });

      it('should throw Error', async () => {
        await expect(
          subscriptionService.addNewEmail(email),
        ).rejects.toThrowError();
      });
    });
  });

  describe('sendEmails method', () => {
    describe('sendEmails method normal operation', () => {
      beforeEach(async () => {
        jest.spyOn(mockedDbService, 'findAll').mockResolvedValue(emailList);
        jest
          .spyOn(mockedExchangeApiService, 'getExchangeRateData')
          .mockResolvedValue(exchangeApiResponse);
      });

      it('should get all data & send emails', async () => {
        await subscriptionService.sendEmails();

        expect(mockedDbService.findAll).toHaveBeenCalled();
        expect(mockedDbService.findAll).toHaveBeenCalledWith(LocalDbName.Email);
        expect(await mockedDbService.findAll(LocalDbName.Email)).toEqual(
          emailList,
        );
        expect(mockedExchangeApiService.getExchangeRateData).toHaveBeenCalled();
        expect(
          mockedExchangeApiService.getExchangeRateData,
        ).toHaveBeenCalledWith(exchangeApiRequest);

        expect(mockedMailService.sendExchangeRateEmail).toHaveBeenCalled();
        expect(mockedMailService.sendExchangeRateEmail).toHaveBeenCalledWith(
          emailList[0],
          exchangeApiResponse,
        );
        expect(mockedMailService.sendExchangeRateEmail).toHaveBeenCalledWith(
          emailList[2],
          exchangeApiResponse,
        );
      });
    });

    describe('sendEmails method because of an empty DB', () => {
      beforeEach(async () => {
        mockedDbService.findAll.mockImplementation(() => {
          throw new Error();
        });
      });

      it('should return null', async () => {
        await expect(subscriptionService.sendEmails()).rejects.toThrowError();
      });
    });

    describe('sendEmails method because of  error thrown by API service', () => {
      beforeEach(async () => {
        mockedExchangeApiService.getExchangeRateData.mockImplementation(() => {
          throw new Error();
        });
      });

      it('should return null', async () => {
        await expect(subscriptionService.sendEmails()).rejects.toThrowError();
      });
    });
  });
});
