// src/transactions/transactions.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { CustomersService } from '../customers/customers.service';
import { PaymentsService } from '../payments/payments.service';
import { MockNotificationService } from '../external/mock-notification.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly customersService: CustomersService,
    private readonly paymentsService: PaymentsService,
  ) {}

  /**
   * Create a new transaction
   */
  async create(dto: CreateTransactionDto) {
    // Validate customer exists
    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
    });

    if (!customer) {
      throw new BadRequestException(`Customer with ID ${dto.customerId} does not exist`);
    }

    // Validate payment method exists
    const payment = await this.prisma.payment.findUnique({
      where: { id: dto.paymentId },
    });

    if (!payment) {
      throw new BadRequestException(`Payment with ID ${dto.paymentId} does not exist`);
    }

    // Create transaction in DB
    const newTransaction = await this.prisma.transaction.create({
      data: {
        customerId: dto.customerId,
        paymentId: dto.paymentId,
        amount: dto.amount,
        status: 'pending',
        currency: dto.currency || 'IDR',
      },
      include: {
        customer: true,
        payment: true,
      },
    });

    // Send notification if status is pending
    if (newTransaction.status === 'pending') {
      await MockNotificationService.sendSMS(
        '081234567890',
        `Transaction ${newTransaction.id} created for amount ${dto.amount} ${dto.currency}`,
      );
    }

    return newTransaction;
  }

  /**
   * Get all transactions
   */
  async findAll() {
    return this.prisma.transaction.findMany({
      include: {
        customer: true,
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get a single transaction by ID
   */
  async findOne(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        customer: true,
        payment: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  /**
   * Update an existing transaction
   */
  async update(id: string, dto: UpdateTransactionDto) {
    // Check if transaction exists
    const existingTransaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!existingTransaction) {
      throw new NotFoundException('Transaction not found');
    }

    return this.prisma.transaction.update({
      where: { id },
      data: {
        ...dto,
      },
      include: {
        customer: true,
        payment: true,
      },
    });
  }

  /**
   * Delete a transaction
   */
  async remove(id: string) {
    // Check if transaction exists
    const existingTransaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!existingTransaction) {
      throw new NotFoundException('Transaction not found');
    }

    return this.prisma.transaction.delete({
      where: { id },
    });
  }
}
