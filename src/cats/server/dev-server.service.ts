import { Injectable } from '@nestjs/common';
import { Cat } from 'src/cats/interface/cat.interface';

@Injectable()
export class DevServerService {
  private devServer: Cat[] = [];

  get server() {
    return this.devServer;
  }

  setServer(cats: Cat[]) {
    this.devServer = cats;
    return this.devServer;
  }
}
