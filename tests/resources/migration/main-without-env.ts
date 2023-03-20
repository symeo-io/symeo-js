import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as contextService from 'request-context';
import { GqlAuthGuard } from './authentication/gql-auth-guard';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    credentials: true,
  });
  app.use(cookieParser());
  app.use(contextService.middleware('request'));
  app.use((req, res, next) => {
    contextService.set('request:sessionId', req.headers.sessionid);
    next();
  });
  app.useGlobalGuards(new GqlAuthGuard());

  await app.listen(3000);
}
bootstrap();
