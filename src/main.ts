import {
  ContextIdFactory,
  HttpAdapterHost,
  LazyModuleLoader,
  NestFactory,
} from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from 'src/common/filter/all-exception.filter';
import { AggregateByTenantContextIdStrategy } from 'src/aggregate-by-tenant-context-id.strategy';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
// import { HttpExceptionFilter } from 'src/common/filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    snapshot: true,
    // rawBody: true, // Buffer로 body를 받을 때
  });

  // app.enableShutdownHooks();

  ContextIdFactory.apply(new AggregateByTenantContextIdStrategy());

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.get(LazyModuleLoader);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  // app.use(cookieParser('mysecret', {}));
  // app.useBodyParser('json'); // 다른 BodyParser 옵션을 쓸 경우
  // app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
