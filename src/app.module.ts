import { Module } from '@nestjs/common';
import { CustomersModule } from './customers/customers.module';
import { TransactionsModule } from './transactions/transactions.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [CustomersModule, TransactionsModule, PaymentsModule],
})
export class AppModule {}
