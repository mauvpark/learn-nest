import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LazyModuleLoader, ModuleRef } from '@nestjs/core';
import { Cat } from './interface/cat.interface';
import { DevServerService } from './server/dev-server.service';
import { ProdServerService } from './server/prod-server.service';

@Injectable({ scope: Scope.REQUEST, durable: true })
export class CatsService {
  // 조건부 Init
  private catsServer: DevServerService | ProdServerService;
  private cats: Cat[] = [];
  private setCats;
  constructor(
    //INFO 가져오고자 하는 provider의 string token과 같은 값을 사용해야 함
    // @Inject('ASYNC_SERVER') catsServer: DevServerService | ProdServerService,
    private moduleRef: ModuleRef,
    private lazyModuleLoader: LazyModuleLoader,
    private configService: ConfigService,
  ) {
    // console.log('ref', moduleRef.get(DevServerService));
    //INFO database host로 연동한다고 가정
    if (configService.get<string>('database.host')?.includes('prod')) {
      const serverService = new ProdServerService();
      this.cats = serverService.server;
      this.setCats = serverService.setServer;
    } else {
      const serverService = new DevServerService();
      this.cats = serverService.server;
      this.setCats = serverService.setServer;
    }
  }

  // async serverInit() {
  //   this.catsServer = await this.moduleRef.create(DevServerService);
  // }

  create(cat: Cat) {
    this.cats.push(cat);
    const serverCats = this.setCats(this.cats);
    return serverCats;
  }

  findAll(): Cat[] {
    return this.cats;
  }

  findOne(id: number) {
    return `This action returns a #${id} cat`;
  }
}
