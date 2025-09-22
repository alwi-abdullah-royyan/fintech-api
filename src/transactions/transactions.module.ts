// src/transactions/transactions.module.ts
import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { CustomersModule } from '../customers/customers.module';
import { PaymentsModule } from '../payments/payments.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [CustomersModule, PaymentsModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, PrismaService], // <-- Added PrismaService here
})
export class TransactionsModule {}
