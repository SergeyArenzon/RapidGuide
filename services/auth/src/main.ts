import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: 'auth-events',
      queueOptions: { durable: true },
      noAck: false,
    },
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const logger = new Logger('Bootstrap');
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: 'http://localhost:3000',
  });
  app.useLogger(logger);

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
