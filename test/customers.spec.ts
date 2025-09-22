import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('CustomersController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    prisma = moduleRef.get(PrismaService);
  });

  afterAll(async () => {
    await prisma.customer.deleteMany();
    await app.close();
  });

  it('/customers (POST) should create customer', async () => {
    const payload = { name: 'Zenix', email: 'zenix@example.com' };
    const res = await request(app.getHttpServer()).post('/customers').send(payload).expect(201);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.email).toBe(payload.email);
  });
});
