export interface Payment {
  id: number;
  customerId: number;  // relasi ke customer
  amount: number;
  status: 'pending' | 'success' | 'failed';
  createdAt: Date;
}
