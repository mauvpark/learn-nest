import { Global, Module } from '@nestjs/common';
import { CatsController } from 'src/cats/cats.controller';
import { CatsService } from 'src/cats/cats.service';
// import { DevServerService } from './server/dev-server.service';
// import { ProdServerService } from './server/prod-server.service';
// import { serverProvider } from './server/server.provider';
// import mockCatsService from './mock-cats.service';

@Global()
@Module({
  controllers: [CatsController],
  providers: [
    // serverProvider,
    // DevServerService,
    // ProdServerService,
    CatsService,
    // default
    /**CatsService,*/
    // Mock service example
    /**{
      provide: CatsService,
    useValue: mockCatsService // mock 서비스
    },*/
  ],
  exports: [CatsService],
})
export class CatsModule {}
