import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LazyModuleLoader, ModuleRef } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Cats } from 'src/cats/cat.entity';
import { CreateCatDto } from 'src/cats/dto/create-cat.dto';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST, durable: true })
export class CatsService {
  // 조건부 Init
  // private catsServer: DevServerService | ProdServerService;
  // private cats: Cat[] = [];
  // private setCats;
  constructor(
    //INFO 가져오고자 하는 provider의 string token과 같은 값을 사용해야 함
    // @Inject('ASYNC_SERVER') catsServer: DevServerService | ProdServerService,
    private moduleRef: ModuleRef,
    private lazyModuleLoader: LazyModuleLoader,
    private configService: ConfigService,
    @InjectRepository(Cats) private catsRepository: Repository<Cats>,
  ) {
    // console.log('ref', moduleRef.get(DevServerService));
    //INFO ENV 파일 database host로 연동한다고 가정
    // if (configService.get<string>('database.host')?.includes('prod')) {
    //   const serverService = new ProdServerService();
    //   this.cats = serverService.server;
    //   this.setCats = serverService.setServer;
    // } else {
    //   const serverService = new DevServerService();
    //   this.cats = serverService.server;
    //   this.setCats = serverService.setServer;
    // }
  }

  // async serverInit() {
  //   this.catsServer = await this.moduleRef.create(DevServerService);
  // }

  create(cat: CreateCatDto) {
    return this.catsRepository.save(cat);
  }

  findOne(id: number) {
    return this.catsRepository.findOneBy({ id });
  }

  findAll(): Promise<Cats[]> {
    return this.catsRepository.find();
  }

  async remove(id: number): Promise<{ code: number; message: string }> {
    try {
      await this.catsRepository.delete(id);
      return { code: 200, message: 'deleted!' };
    } catch (error) {
      return { code: 400, message: 'failed!' };
    }
  }
}
