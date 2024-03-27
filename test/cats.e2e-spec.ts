import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CatsModule } from '../src/cats/cats.module';
import { CatsService } from '../src/cats/cats.service';

const expectedResults = [
  { name: 'Mat', breed: 'Ragdoll', age: 2 },
  { name: 'Doll', breed: 'Siberian', age: 1 },
];

// e2e request, response 테스트
describe('Cats', () => {
  let app: INestApplication;
  const catsService = { findAll: () => expectedResults };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CatsModule],
    })
      .overrideProvider(CatsService)
      .useValue(catsService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET cats`, () => {
    return request(app.getHttpServer())
      .get('/cats')
      .expect(200)
      .expect(catsService.findAll());
  });

  afterAll(async () => {
    await app.close();
  });
});
