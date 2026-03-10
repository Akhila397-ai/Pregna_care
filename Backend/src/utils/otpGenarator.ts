export class OTPGenerator {
  static generate(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static expiry(): Date {
    return new Date(Date.now() + 5 * 60 * 1000);
  }
}