export class MockNotificationService {
  static sendEmail(to: string, subject: string, body: string) {
    console.log(`📧 Sending email to ${to} | ${subject}: ${body}`);
    return true;
  }

  static sendSMS(to: string, message: string) {
    console.log(`📱 Sending SMS to ${to}: ${message}`);
    return true;
  }
}
