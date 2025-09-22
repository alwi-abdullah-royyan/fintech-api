import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  const mockTransactionsService = {
    create: jest.fn((dto) =>
      Promise.resolve({
        id: 'tx-123',
        ...dto,
        status: 'pending',
        customer: { id: dto.customerId },
        payment: { id: dto.paymentId },
      }),
    ),
    findAll: jest.fn(() =>
      Promise.resolve([
        {
          id: 'tx-123',
          amount: 100,
          customer: { id: 'cust-123' },
          payment: { id: 'pay-123' },
          status: 'pending',
        },
      ]),
    ),
    findOne: jest.fn((id) =>
      Promise.resolve({
        id,
        amount: 100,
        customer: { id: 'cust-123' },
        payment: { id: 'pay-123' },
        status: 'pending',
      }),
    ),
    update: jest.fn((id, dto) =>
      Promise.resolve({ id, ...dto, customer: { id: 'cust-123' }, payment: { id: 'pay-123' } }),
    ),
    remove: jest.fn((id) => Promise.resolve({ id, amount: 100, status: 'pending' })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [{ provide: TransactionsService, useValue: mockTransactionsService }],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should create a transaction', async () => {
    const dto: CreateTransactionDto = {
      customerId: 'cust-123',
      paymentId: 'pay-123',
      amount: 100,
      currency: 'USD',
    };
    const result = await controller.create(dto);
    expect(result).toHaveProperty('id', 'tx-123');
    expect(result.amount).toBe(100);
    expect(result.customer.id).toBe('cust-123');
  });

  it('should return all transactions', async () => {
    const all = await controller.findAll();
    expect(Array.isArray(all)).toBe(true);
    expect(all[0]).toHaveProperty('id', 'tx-123');
  });

  it('should return a single transaction', async () => {
    const tx = await controller.findOne('tx-123');
    expect(tx).toHaveProperty('id', 'tx-123');
  });

  it('should update a transaction', async () => {
    const dto: UpdateTransactionDto = { status: 'completed' };
    const updated = await controller.update('tx-123', dto);
    expect(updated.status).toBe('completed');
  });

  it('should remove a transaction', async () => {
    const deleted = await controller.remove('tx-123');
    expect(deleted).toHaveProperty('id', 'tx-123');
  });
});
