export interface IEmailService {

    sendOtp(to: string, otp: string, purpose: string):Promise<void>;
}