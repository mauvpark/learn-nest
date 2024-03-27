import {
  ContextIdFactory,
  HttpAdapterHost,
  LazyModuleLoader,
  NestFactory,
} from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from 'src/common/filter/all-exception.filter';
import { AggregateByTenantContextIdStrategy } from 'src/aggregate-by-tenant-context-id.strategy';
// import { HttpExceptionFilter } from 'src/common/filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });

  // app.enableShutdownHooks();

  ContextIdFactory.apply(new AggregateByTenantContextIdStrategy());

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.get(LazyModuleLoader);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  // app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
