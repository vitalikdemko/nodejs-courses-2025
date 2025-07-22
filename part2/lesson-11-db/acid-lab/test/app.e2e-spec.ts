import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource, Repository } from 'typeorm';
import { Account } from './../src/transfer/entities/account.entity';
import { Movement } from './../src/transfer/entities/movement.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Transfer(e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let accountRepo: Repository<Account>;
  let movementRepo: Repository<Movement>;

  const fromId = '11111111-1111-1111-1111-111111111111';
 
  const toId = '22222222-2222-2222-2222-222222222222';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get(DataSource);
    accountRepo = moduleFixture.get(getRepositoryToken(Account));
    movementRepo = moduleFixture.get(getRepositoryToken(Movement));

    // clare db 
    await movementRepo.createQueryBuilder().delete().execute();
    await accountRepo.createQueryBuilder().delete().execute();

    //create accounts
    await accountRepo.insert([
      { id: fromId, balance: 100 },
      { id: toId, balance: 200 },
    ]);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Does not allow transfer when the balance is insufficient, and the database remains unchanged', async () => {
    await request(app.getHttpServer())
      .post('/transfer')
      .send({ fromId, toId, amount: 999 })
      .expect(400);

    const from = await accountRepo.findOneBy({ id: fromId });
    const to = await accountRepo.findOneBy({ id: toId });
    const movements = await movementRepo.find();

    expect(Number(from?.balance)).toBe(100);
    expect(Number(to?.balance)).toBe(200);
    expect(movements.length).toBe(0);
  });
});
