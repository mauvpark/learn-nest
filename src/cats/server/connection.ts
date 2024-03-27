import { DevServerService } from 'src/cats/server/dev-server.service';
import { ProdServerService } from 'src/cats/server/prod-server.service';

export function connection(provider: DevServerService | ProdServerService) {
  return new Promise((resolve, deny) => {
    try {
      setTimeout(() => resolve(provider), 1000);
    } catch (e) {
      deny(e);
    }
  });
}
