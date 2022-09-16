import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { sendEmailsResult, subscriptionEmail } from '../../../test/mock-data';
import { SubscribeEmailDto } from '../../dto';
import { SubscriptionService } from '../../service';
import { SubscriptionController } from '../subscription.controller';

describe('Subscription Controller', () => {
  let subscriptionController: SubscriptionController;

  const mockedSubscriptionService = {
    addNewEmail: jest.fn(),
    sendEmails: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionController],
      providers: [
        {
          provide: SubscriptionService,
          useValue: mockedSubscriptionService,
        },
      ],
    }).compile();

    subscriptionController = moduleRef.get<SubscriptionController>(
      SubscriptionController,
    );
  });

  describe('All dependencies should be defined', () => {
    it('should be defined', () => {
      expect(subscriptionController).toBeDefined();
      expect(mockedSubscriptionService).toBeDefined();
    });
  });

  describe('subscribeEmail method', () => {
    const { ok: email } = subscriptionEmail;
    const subscribeEmailDto: SubscribeEmailDto = { email };

    describe('subscribeEmail method normal operation', () => {
      beforeEach(async () => {
        jest
          .spyOn(mockedSubscriptionService, 'addNewEmail')
          .mockResolvedValue(email);
      });

      it('should return a value', async () => {
        await subscriptionController.subscribeEmail(subscribeEmailDto);

        expect(mockedSubscriptionService.addNewEmail).toHaveBeenCalled();
        expect(mockedSubscriptionService.addNewEmail).toHaveBeenCalledWith(
          email,
        );
        expect(
          await subscriptionController.subscribeEmail(subscribeEmailDto),
        ).toBe(email);
      });
    });

    describe('subscribeEmail method with BadRequestException', () => {
      beforeEach(async () => {
        jest
          .spyOn(mockedSubscriptionService, 'addNewEmail')
          .mockResolvedValue(null);
      });

      it('should throw BadRequestException', async () => {
        await expect(
          subscriptionController.subscribeEmail(subscribeEmailDto),
        ).rejects.toThrowError(BadRequestException);
      });
    });
  });

  describe('sendEmails method', () => {
    describe('subscribeEmail method normal operation', () => {
      beforeEach(async () => {
        jest
          .spyOn(mockedSubscriptionService, 'sendEmails')
          .mockResolvedValue(sendEmailsResult);
      });

      it('should be an array with results', async () => {
        await subscriptionController.sendEmails();

        expect(mockedSubscriptionService.sendEmails).toHaveBeenCalled();
        expect(await subscriptionController.sendEmails()).toBe(
          sendEmailsResult,
        );
      });
    });
  });
});
