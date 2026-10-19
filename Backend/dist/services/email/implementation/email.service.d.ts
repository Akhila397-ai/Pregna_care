import 'reflect-metadata';
import { IEmailService } from '../interface/IEmail.service.js';
export declare class EmailService implements IEmailService {
    private transporter;
    private getTransporter;
    sendOtp(to: string, otp: string, purpose: string): Promise<void>;
    private _getSubject;
    private _getTemplate;
}
//# sourceMappingURL=email.service.d.ts.map