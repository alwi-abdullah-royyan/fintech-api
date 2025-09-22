export class CreatePaymentDto {
  customerId: string;
  amount: number;
  method?: string;
  provider?: string;
}
