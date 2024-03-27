import { Test } from '@nestjs/testing';
import { Cat } from 'src/cats/interface/cat.interface';
// import { serverProvider } from 'src/cats/server/server.provider';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

const expectedResults = [
  { name: 'Mat', breed: 'Ragdoll', age: 2 },
  { name: 'Doll', breed: 'Siberian', age: 1 },
];

describe('CatsController', () => {
  let catsController: CatsController;
  let catsService: CatsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CatsController],
      // providers: [CatsService, serverProvider],
    })
      // production provider가 아닌 mock provider가 필요할 경우
      .useMocker((token) => {
        if (token === CatsService) {
          return { findAll: jest.fn().mockResolvedValue(expectedResults) };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    catsService = moduleRef.get<CatsService>(CatsService);
    catsController = moduleRef.get<CatsController>(CatsController);
  });

  describe('findAll', () => {
    it('should return an array of cats', async () => {
      const result: Cat[] = [{ name: 'Mat', breed: 'Ragdoll', age: 2 }];
      jest.spyOn(catsService, 'findAll').mockImplementation(() => result);

      expect(await catsController.findAll()).toBe(result);
    });
  });
});
