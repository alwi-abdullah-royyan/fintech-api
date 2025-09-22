import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaction.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @ApiProperty({ enum: ['pending', 'completed', 'failed'], required: false })
  status?: 'pending' | 'completed' | 'failed';
}
