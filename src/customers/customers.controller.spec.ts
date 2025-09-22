import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

describe('CustomersController', () => {
  let controller: CustomersController;
  let service: CustomersService;

  const mockCustomersService = {
    create: jest.fn((dto) => Promise.resolve({ id: 'uuid-123', ...dto })),
    findAll: jest.fn(() =>
      Promise.resolve([{ id: 'uuid-123', name: 'John Doe', email: 'john@example.com' }]),
    ),
    update: jest.fn((id, dto) => Promise.resolve({ id, ...dto })),
    remove: jest.fn((id) => Promise.resolve({ id, name: 'Deleted', email: 'deleted@example.com' })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: mockCustomersService,
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    service = module.get<CustomersService>(CustomersService);
  });

  it('should create a customer', async () => {
    const dto = { name: 'John Doe', email: 'john@example.com' };
    const result = await controller.create(dto);

    expect(result).toHaveProperty('id');
    expect(result.name).toBe('John Doe');
    expect(result.email).toBe('john@example.com');
  });

  it('should return all customers', async () => {
    const allCustomers = await controller.findAll();
    expect(Array.isArray(allCustomers)).toBe(true);
    expect(allCustomers[0]).toHaveProperty('id');
  });

  it('should update a customer', async () => {
    const dto = { name: 'Jane Doe', email: 'jane@example.com' };
    const result = await controller.update('uuid-123', dto);
    expect(result.name).toBe('Jane Doe');
  });

  it('should remove a customer', async () => {
    const result = await controller.remove('uuid-123');
    expect(result).toHaveProperty('id', 'uuid-123');
  });
});
