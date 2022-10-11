import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomLoggerModule } from './custom-logger/custom-logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    CustomLoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppLoggerModule {}
