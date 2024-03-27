import { connection } from 'src/cats/server/connection';
import { DevServerService } from 'src/cats/server/dev-server.service';
import { ProdServerService } from 'src/cats/server/prod-server.service';

export const serverProvider = {
  provide: 'ASYNC_SERVER', // String 토큰으로 provider 간 공유 가능
  useFactory: async (
    devServerProvider: DevServerService,
    prodServerProvider: ProdServerService,
  ) => {
    const provider =
      process.env.NODE_ENV === 'development'
        ? devServerProvider
        : prodServerProvider;

    const connectedProvider = await connection(provider); // 서버 구성에 있어 서로 다른 로직이 비동기적으로 영향을 주는 구조일 때 async/await 구문을 사용해 custom provider를 만들 수 있음
    return connectedProvider;
  },
  inject: [DevServerService, ProdServerService],
};
