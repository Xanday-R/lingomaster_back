import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {useContainer} from 'class-validator';
import {CorsOptions} from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const corsOptions: CorsOptions = {
    origin: 'https://lingomaster.vercel.app',
    // origin: 'http://localhost:4200',
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
    allowedHeaders: ['Content-Type', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials','Cookie', 'Authorization',],
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
  };
  app.enableCors(corsOptions);
  await app.listen(3000);
}
bootstrap();
