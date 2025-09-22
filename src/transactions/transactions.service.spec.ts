import { TransactionsService } from './transactions.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { MockNotificationService } from '../external/mock-notification.service';

describe('TransactionsService', () => {
  let service: TransactionsService;

  const mockPrisma = {
    customer: {
      findUnique: jest.fn(({ where }) =>
        where.id === 'cust-123'
          ? Promise.resolve({ id: 'cust-123', name: 'John' })
          : Promise.resolve(null),
      ),
    },
    payment: {
      findUnique: jest.fn(({ where }) =>
        where.id === 'pay-123'
          ? Promise.resolve({ id: 'pay-123', method: 'Credit Card' })
          : Promise.resolve(null),
      ),
    },
    transaction: {
      create: jest.fn(({ data }) =>
        Promise.resolve({
          id: 'tx-123',
          ...data,
          customer: { id: data.customerId, name: 'John' },
          payment: { id: data.paymentId, method: 'Credit Card' },
        }),
      ),
      findMany: jest.fn(() =>
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
      findUnique: jest.fn(({ where }) =>
        where.id === 'tx-123'
          ? Promise.resolve({
              id: 'tx-123',
              amount: 100,
              customer: { id: 'cust-123' },
              payment: { id: 'pay-123' },
              status: 'pending',
            })
          : Promise.resolve(null),
      ),
      update: jest.fn(({ where, data }) =>
        Promise.resolve({
          id: where.id,
          ...data,
          customer: { id: 'cust-123' },
          payment: { id: 'pay-123' },
        }),
      ),
      delete: jest.fn(({ where }) => Promise.resolve({ id: where.id, amount: 100 })),
    },
  };

  beforeEach(() => {
    jest.spyOn(MockNotificationService, 'sendSMS').mockResolvedValue(undefined);

    service = new TransactionsService(
      mockPrisma as any,
      {} as any, // customersService not used since Prisma is mocked
      {} as any, // paymentsService not used since Prisma is mocked
    );
  });

  it('should create a transaction', async () => {
    const dto: CreateTransactionDto = {
      customerId: 'cust-123',
      paymentId: 'pay-123',
      amount: 100,
      currency: 'USD',
    };
    const result = await service.create(dto);

    expect(result).toHaveProperty('id', 'tx-123');
    expect(result.amount).toBe(100);
    expect(result.status).toBe('pending');
  });

  it('should throw BadRequestException if customer does not exist', async () => {
    const dto: CreateTransactionDto = { customerId: 'invalid', paymentId: 'pay-123', amount: 100 };
    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if payment does not exist', async () => {
    const dto: CreateTransactionDto = { customerId: 'cust-123', paymentId: 'invalid', amount: 100 };
    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should return all transactions', async () => {
    const all = await service.findAll();
    expect(Array.isArray(all)).toBe(true);
    expect(all[0]).toHaveProperty('id', 'tx-123');
  });

  it('should get a single transaction', async () => {
    const tx = await service.findOne('tx-123');
    expect(tx).toHaveProperty('id', 'tx-123');
  });

  it('should throw NotFoundException if transaction not found', async () => {
    await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
  });

  it('should update a transaction', async () => {
    const dto: UpdateTransactionDto = { status: 'completed' };
    const updated = await service.update('tx-123', dto);
    expect(updated.status).toBe('completed');
  });

  it('should throw NotFoundException when updating non-existent transaction', async () => {
    const dto: UpdateTransactionDto = { status: 'completed' };
    await expect(service.update('invalid', dto)).rejects.toThrow(NotFoundException);
  });

  it('should remove a transaction', async () => {
    const deleted = await service.remove('tx-123');
    expect(deleted).toHaveProperty('id', 'tx-123');
  });

  it('should throw NotFoundException when deleting non-existent transaction', async () => {
    await expect(service.remove('invalid')).rejects.toThrow(NotFoundException);
  });
});
