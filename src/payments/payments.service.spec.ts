import { PaymentsService } from './payments.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { MockPaymentGateway } from '../external/mock-payment.gateway';
import { MockNotificationService } from '../external/mock-notification.service';

describe('PaymentsService', () => {
  let service: PaymentsService;

  const mockPrisma = {
    customer: {
      findUnique: jest.fn(({ where }) => {
        if (where.id === 'cust-123') return Promise.resolve({ id: 'cust-123', name: 'John' });
        return Promise.resolve(null);
      }),
    },
    payment: {
      create: jest.fn(({ data }) =>
        Promise.resolve({
          id: 'pay-123',
          ...data,
          customer: { id: data.customerId, name: 'John' },
        }),
      ),
      findMany: jest.fn(() =>
        Promise.resolve([
          { id: 'pay-123', amount: 100, customer: { id: 'cust-123', name: 'John' } },
        ]),
      ),
      findUnique: jest.fn(({ where }) => {
        if (where.id === 'pay-123')
          return Promise.resolve({
            id: 'pay-123',
            amount: 100,
            customer: { id: 'cust-123', name: 'John' },
          });
        return Promise.resolve(null);
      }),
      update: jest.fn(({ where, data }) =>
        Promise.resolve({ id: where.id, ...data, customer: { id: 'cust-123', name: 'John' } }),
      ),
      delete: jest.fn(({ where }) => Promise.resolve({ id: where.id, amount: 100 })),
    },
  };

  beforeEach(() => {
    // Mock external services
    jest.spyOn(MockPaymentGateway, 'processPayment').mockReturnValue({ status: 'success' });
    jest.spyOn(MockNotificationService, 'sendEmail').mockResolvedValue(undefined);

    service = new PaymentsService(mockPrisma as any);
  });

  it('should create a payment', async () => {
    const dto: CreatePaymentDto = { customerId: 'cust-123', amount: 100 };
    const result = await service.create(dto);

    expect(result).toHaveProperty('id', 'pay-123');
    expect(result.amount).toBe(100);
    expect(result.status).toBe('success');
  });

  it('should throw BadRequestException if customer does not exist', async () => {
    const dto: CreatePaymentDto = { customerId: 'invalid', amount: 100 };
    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should return all payments', async () => {
    const payments = await service.findAll();
    expect(Array.isArray(payments)).toBe(true);
    expect(payments[0]).toHaveProperty('id', 'pay-123');
  });

  it('should get a payment by id', async () => {
    const payment = await service.findOne('pay-123');
    expect(payment).toHaveProperty('id', 'pay-123');
  });

  it('should throw NotFoundException if payment not found', async () => {
    await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
  });

  it('should update a payment', async () => {
    const dto: UpdatePaymentDto = { amount: 200 };
    const updated = await service.update('pay-123', dto);
    expect(updated.amount).toBe(200);
  });

  it('should throw NotFoundException when updating non-existent payment', async () => {
    const dto: UpdatePaymentDto = { amount: 200 };
    await expect(service.update('invalid', dto)).rejects.toThrow(NotFoundException);
  });

  it('should remove a payment', async () => {
    const deleted = await service.remove('pay-123');
    expect(deleted).toHaveProperty('id', 'pay-123');
  });

  it('should throw NotFoundException when deleting non-existent payment', async () => {
    await expect(service.remove('invalid')).rejects.toThrow(NotFoundException);
  });
});
