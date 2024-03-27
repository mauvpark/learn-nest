import { Injectable } from '@nestjs/common';
import { Cat } from 'src/cats/interface/cat.interface';

@Injectable()
export class ProdServerService {
  private prodServer: Cat[] = [];

  get server() {
    return this.prodServer;
  }

  setServer(cats: Cat[]) {
    this.prodServer = cats;
  }
}
