import { config as symeoConfig } from 'symeo-js';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as contextService from 'request-context';
import { GqlAuthGuard } from './authentication/gql-auth-guard';
import { AppModule } from './app.module';

if (symeoConfig.nodeEnv === 'local' || symeoConfig.nodeEnv === 'test') {
  console.log('Running local');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    credentials: true,
    origin: symeoConfig.corsAuthorizedOrigin,
  });
  app.use(cookieParser());
  app.use(contextService.middleware('request'));
  app.use((req, res, next) => {
    contextService.set('request:sessionId', req.headers.sessionid);
    next();
  });
  app.useGlobalGuards(new GqlAuthGuard());
  app.logging(symeoConfig.logging);

  await app.listen(3000);
}
bootstrap();
