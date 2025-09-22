import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: PaymentsService;

  const mockPaymentsService = {
    create: jest.fn((dto) => Promise.resolve({ id: 'uuid-123', ...dto })),
    findAll: jest.fn(() =>
      Promise.resolve([{ id: 'uuid-123', type: 'Credit Card', details: '**** **** **** 1234' }]),
    ),
    findOne: jest.fn((id) =>
      Promise.resolve({ id, type: 'Credit Card', details: '**** **** **** 1234' }),
    ),
    update: jest.fn((id, dto) =>
      Promise.resolve({
        id,
        type: dto.type || 'Credit Card',
        details: dto.details || '**** **** **** 1234',
      }),
    ),
    remove: jest.fn((id) => Promise.resolve({ id, type: 'Deleted', details: 'Deleted' })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: mockPaymentsService,
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should create a payment', async () => {
    const dto: CreatePaymentDto = { type: 'Credit Card', details: '**** **** **** 1234' };
    const result = await controller.create(dto);
    expect(result).toHaveProperty('id');
    expect(result.type).toBe('Credit Card');
  });

  it('should return all payments', async () => {
    const all = await controller.findAll();
    expect(Array.isArray(all)).toBe(true);
    expect(all[0]).toHaveProperty('id');
  });

  it('should get a single payment', async () => {
    const result = await controller.findOne('uuid-123');
    expect(result).toHaveProperty('id', 'uuid-123');
  });

  it('should update a payment', async () => {
    const dto: UpdatePaymentDto = { type: 'Debit Card' };
    const result = await controller.update('uuid-123', dto);
    expect(result.type).toBe('Debit Card');
  });

  it('should remove a payment', async () => {
    const result = await controller.remove('uuid-123');
    expect(result).toHaveProperty('id', 'uuid-123');
    expect(result.type).toBe('Deleted');
  });
});
