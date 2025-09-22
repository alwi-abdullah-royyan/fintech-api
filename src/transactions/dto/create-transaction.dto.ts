import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'The ID of the customer associated with the transaction',
    example: 'e3d0c2b6-4b8f-11ee-be56-0242ac120002',
  })
  customerId: string;

  @ApiProperty({
    description: 'The ID of the payment method used for the transaction',
    example: 'd5f8a7b0-4b8f-11ee-be56-0242ac120002',
  })
  paymentId: string;

  @ApiProperty({
    description: 'The amount of the transaction',
    example: 1500,
  })
  amount: number;

  @ApiProperty({
    description: 'The currency of the transaction (e.g., USD, EUR, GBP)',
    example: 'USD',
  })
  currency?: string;
}
