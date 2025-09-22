import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { MockPaymentGateway } from '../external/mock-payment.gateway';
import { MockNotificationService } from '../external/mock-notification.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * CREATE payment
   */
  async create(dto: CreatePaymentDto) {
    // Validate customer exists
    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
    });
    if (!customer) {
      throw new BadRequestException(`Customer with ID ${dto.customerId} does not exist`);
    }

    // Simulate payment gateway
    const result = MockPaymentGateway.processPayment(dto.amount);

    // Create payment in DB
    const payment = await this.prisma.payment.create({
      data: {
        customerId: dto.customerId,
        amount: dto.amount,
        method: dto.method || 'unknown',
        provider: dto.provider || 'mock',
        status: result.status,
      },
      include: {
        customer: true,
      },
    });

    // Send notification
    await MockNotificationService.sendEmail(
      'customer@example.com',
      'Payment Status',
      `Your payment of ${dto.amount} is ${payment.status}`,
    );

    return payment;
  }

  /**
   * READ - all payments
   */
  async findAll() {
    return this.prisma.payment.findMany({
      include: { customer: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * READ - payment by ID
   */
  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { customer: true },
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  /**
   * UPDATE payment
   */
  async update(id: string, dto: UpdatePaymentDto) {
    // Ensure payment exists
    const existing = await this.prisma.payment.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Payment not found');

    return this.prisma.payment.update({
      where: { id },
      data: {
        ...dto,
      },
      include: { customer: true },
    });
  }

  /**
   * DELETE payment
   */
  async remove(id: string) {
    const existing = await this.prisma.payment.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Payment not found');

    return this.prisma.payment.delete({ where: { id } });
  }
}
