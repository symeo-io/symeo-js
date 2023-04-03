import { config as symeoConfig } from '@symeo-sdk';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as contextService from 'request-context';
import { GqlAuthGuard } from './authentication/gql-auth-guard';
import { AppModule } from './app.module';

if (process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'test') {
  console.log('Running local');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    credentials: true,
    origin: process.env.CORS_AUTHORIZED_ORIGIN,
  });
  app.use(cookieParser());
  app.use(contextService.middleware('request'));
  app.use((req, res, next) => {
    contextService.set('request:sessionId', req.headers.sessionid);
    next();
  });
  app.useGlobalGuards(new GqlAuthGuard());
  app.logging(process.env.LOGGING);

  await app.listen(3000);
}
bootstrap();
