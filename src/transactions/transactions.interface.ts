export interface Transaction {
  id: number;
  customerId: number;
  paymentId: number;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}
