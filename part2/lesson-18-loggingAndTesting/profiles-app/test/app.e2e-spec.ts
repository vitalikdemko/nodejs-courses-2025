import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { ProfilesModule } from '../src/profiles/profiles.module';
import { AppLogger } from '../src/common/logger.service';
import { HttpErrorLoggingFilter } from '../src/common/http-error-logging.filter';

describe('Profiles E2E', () => {
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

  it('201 on valid POST /profiles with Bearer test', async () => {
    await request(app.getHttpServer())
      .post('/profiles')
      .set('authorization', 'Bearer test')
      .send({ email: 'tratataa@aaa.aa', displayName: 'Vitalik', age: 30 })
      .expect(201)
      .expect(({ body }) => expect(body).toHaveProperty('id'));

    expect(loggerMock.log).toHaveBeenCalledWith(
      'profile.created',
      expect.objectContaining({ email: 'tratataa@aaa.aa' }),
    );
  });

  it('401 on POST /profiles without token', () => {
    return request(app.getHttpServer())
      .post('/profiles')
      .send({ email: 'tratataa@aaa.aa', displayName: 'Vitalik', age: 30 })
      .expect(401);
  });

  it('400 on invalid body and logger.error called', async () => {
    await request(app.getHttpServer())
      .post('/profiles')
      .set('authorization', 'Bearer test')
      .send({ email: 'not-an-email', displayName: 'A', age: -5 })
      .expect(400);

    expect(loggerMock.error).toHaveBeenCalled();
  });
});
