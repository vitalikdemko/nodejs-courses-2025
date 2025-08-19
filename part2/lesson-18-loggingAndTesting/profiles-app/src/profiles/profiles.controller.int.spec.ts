import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { ProfilesModule } from './profiles.module';
import { AppLogger } from '../common/logger.service';
import { HttpErrorLoggingFilter } from '../common/http-error-logging.filter';

describe('ProfilesController (integration)', () => {
  let app: INestApplication;
  const loggerMock = { log: jest.fn(), error: jest.fn() };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [ProfilesModule] })
      .overrideProvider(AppLogger).useValue(loggerMock)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new HttpErrorLoggingFilter(app.get(AppLogger))); 
    await app.init();
  });

  afterAll(async () => { await app.close(); });

  it('POST /profiles -> 201 + id (with auth header)', () => {
    return request(app.getHttpServer())
      .post('/profiles')
      .set('authorization', 'Bearer test')
      .send({ email: 'tratataa@aaa.aa', displayName: 'Vitalik', age: 30 })
      .expect(201)
      .expect(({ body }) => expect(body).toHaveProperty('id'));
  });

  it('POST /profiles invalid -> 400 and logger.error called', async () => {
    await request(app.getHttpServer())
      .post('/profiles')
      .set('authorization', 'Bearer test')
      .send({ email: 'bad', displayName: 'A', age: -1 })
      .expect(400);

    expect(loggerMock.error).toHaveBeenCalled();
  });
});
