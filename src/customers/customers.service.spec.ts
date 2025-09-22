import { CustomersService } from './customers.service';
import { NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

describe('CustomersService', () => {
  let service: CustomersService;

  const mockPrisma = {
    customer: {
      create: jest.fn((dto) => Promise.resolve({ id: 'uuid-123', ...dto.data })),
      findMany: jest.fn(() =>
        Promise.resolve([{ id: 'uuid-123', name: 'John Doe', email: 'john@example.com' }]),
      ),
      findUnique: jest.fn(({ where }) => {
        if (where.id === 'uuid-123') {
          return Promise.resolve({ id: 'uuid-123', name: 'John Doe', email: 'john@example.com' });
        }
        return Promise.resolve(null);
      }),
      update: jest.fn(({ where, data }) =>
        Promise.resolve({
          id: where.id,
          name: data.name || 'John Doe',
          email: data.email || 'john@example.com',
        }),
      ),
      delete: jest.fn(({ where }) =>
        Promise.resolve({ id: where.id, name: 'Deleted', email: 'deleted@example.com' }),
      ),
    },
  };

  beforeEach(() => {
    service = new CustomersService(mockPrisma as any);
  });

  it('should create a customer', async () => {
    const dto: CreateCustomerDto = { name: 'John Doe', email: 'john@example.com' };
    const result = await service.create(dto);

    expect(result).toHaveProperty('id');
    expect(result.name).toBe('John Doe');
    expect(result.email).toBe('john@example.com');
  });

  it('should return all customers', async () => {
    const all = await service.findAll();
    expect(Array.isArray(all)).toBe(true);
    expect(all[0]).toHaveProperty('id');
  });

  it('should update a customer', async () => {
    const updateDto: UpdateCustomerDto = { name: 'Johnny' };
    const result = await service.update('uuid-123', updateDto);
    expect(result.name).toBe('Johnny');
  });

  it('should throw NotFoundException when updating non-existent customer', async () => {
    await expect(service.update('non-existent', { name: 'Ghost' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should remove a customer', async () => {
    const result = await service.remove('uuid-123');
    expect(result.id).toBe('uuid-123');
  });

  it('should throw NotFoundException when deleting non-existent customer', async () => {
    await expect(service.remove('non-existent')).rejects.toThrow(NotFoundException);
  });
});
