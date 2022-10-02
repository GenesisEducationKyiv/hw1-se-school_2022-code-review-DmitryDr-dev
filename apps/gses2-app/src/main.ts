import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './common/pipes';

async function bootstrap() {
  const PORT = process.env.APP_PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('gses2.app/api');
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT, () => console.info(`Server runs on port: ${PORT}`));
}
bootstrap();
