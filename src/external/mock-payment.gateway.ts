export class MockPaymentGateway {
  static processPayment(amount: number): { status: 'success' | 'failed'; transactionId: string } {
    const success = Math.random() > 0.2;
    return {
      status: success ? 'success' : 'failed',
      transactionId: `PAY-${Date.now()}`
    };
  }
}
