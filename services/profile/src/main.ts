import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });
  app.enableCors({ credentials: true });
  // app.useGlobalPipes(new ZodValidationPipe());
  const logger = new Logger('Bootstrap');
  app.useLogger(logger);
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);

  // const microservice = app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [process.env.RABBITMQ_HOST],
  //     queue: 'user_queue',
  //     queueOptions: { durable: true },
  //   },
  // });
  // await microservice.listen();
}
bootstrap();
