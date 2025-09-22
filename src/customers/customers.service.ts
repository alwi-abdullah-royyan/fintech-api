// src/customers/customers.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {} // inject Prisma

  /**
   * Create a new customer
   */
  async create(dto: CreateCustomerDto) {
    const newCustomer = await this.prisma.customer.create({
      data: {
        ...dto,
      },
    });
    return newCustomer;
  }

  /**
   * Get all customers
   */
  async findAll() {
    return this.prisma.customer.findMany({
      orderBy: { id: 'asc' }, // or 'desc' if you prefer
    });
  }

  /**
   * Get a single customer by ID
   */
  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  /**
   * Update an existing customer
   */
  async update(id: string, dto: UpdateCustomerDto) {
    // Check if customer exists
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { id },
    });
    if (!existingCustomer) throw new NotFoundException('Customer not found');

    return this.prisma.customer.update({
      where: { id },
      data: { ...dto },
    });
  }

  /**
   * Delete a customer
   */
  async remove(id: string) {
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { id },
    });
    if (!existingCustomer) throw new NotFoundException('Customer not found');

    return this.prisma.customer.delete({
      where: { id },
    });
  }
}
