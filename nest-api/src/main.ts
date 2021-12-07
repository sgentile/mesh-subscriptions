import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(9001);
  console.log(`nest-api is running on: ${await app.getUrl()}`);
}
bootstrap();
