import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatEntity } from 'src/cats/model/entity/cat.entity';
import { CatsController } from 'src/cats/cats.controller';
import { CatsService } from 'src/cats/cats.service';
// import { DevServerService } from './server/dev-server.service';
// import { ProdServerService } from './server/prod-server.service';
// import { serverProvider } from './server/server.provider';
// import mockCatsService from './mock-cats.service';

@Module({
  imports: [TypeOrmModule.forFeature([CatEntity])],
  controllers: [CatsController],
  providers: [
    CatsService,
    //INFO Mock Server
    // serverProvider,
    // DevServerService,
    // ProdServerService,
    //INFO Mock Service 예시
    /**{
      provide: CatsService,
    useValue: mockCatsService
    },*/
  ],
  exports: [CatsService, TypeOrmModule],
})
export class CatsModule {}
