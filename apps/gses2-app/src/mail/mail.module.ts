import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import { MailService } from './service';
import { MailProcessor } from './processor';

export const IMailServiceToken = Symbol.for('IMailService');
export const IMailProcessorToken = Symbol.for('IMailProcessor');

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          port: config.get('MAIL_PORT'),
          secure: true,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_USER')}>`,
        },
        template: {
          dir: path.join(__dirname, './templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'mailQueue',
    }),
    ConfigModule.forRoot(),
  ],
  providers: [
    {
      provide: IMailServiceToken,
      useClass: MailService,
    },
    {
      provide: IMailProcessorToken,
      useClass: MailProcessor,
    },
  ],
  exports: [IMailServiceToken],
})
export class MailModule {}
