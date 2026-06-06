import 'reflect-metadata';
import { injectable } from 'inversify';
import nodemailer, {Transporter, SendMailOptions} from 'nodemailer';
import { IEmailService } from '../interface/IEmail.service.js';
import { error } from 'node:console';


@injectable()
export class EmailService implements IEmailService {

   private  transporter : Transporter;

   constructor() {
    this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth : {
            user: process.env.EMAIL_USER as string,
            pass: process.env.EMAIL_PASS as string
        }
    })

    this.transporter.verify((error)=>{
        if(error){
             console.error('[EmailService] Connection failed:', error.message);
        }else {
             console.log('[EmailService] Ready to send emails');
        }
    })
   }

   async sendOtp(to: string, otp: string, purpose: string): Promise<void> {
       const mailOptions: SendMailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: this._getSubject(purpose),
        html: this._getTemplate(otp,purpose)
       }
       try {
        const info = await this.transporter.sendMail(mailOptions);
        console.log(`[EmailService] OTP sent | to: ${to} | messageId: ${info.messageId}`);

       } catch (error:unknown) {
        console.error(`[EmailService] Failed | to: ${to} | error: ${error}`);
        throw new Error('Failed to send OTP email. Please try again.');
        
       }
   }

   private _getSubject(purpose: string): string {
    const subjects: Record<string, string> = {
        signup:          '🌸 Verify your Pregna Care account',
        forgot_password: '🔐 Reset your Pregna Care password',
        resend_otp:      '🔄 Your new Pregna Care OTP',
    }
    return subjects[purpose] ?? "Your Pregna Care OTP"
   }

   private _getTemplate(otp: string, purpose: string): string {
    const purposeText: Record<string, string> = {
      signup:          'verify your account',
      forgot_password: 'reset your password',
      resend_otp:      'verify your account',
   }
   const actionText = purposeText[purpose] ?? 'complete your request';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Pregna Care OTP</title>
        </head>
        <body style="
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
          font-family: Arial, sans-serif;
        ">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table width="500" cellpadding="0" cellspacing="0" style="
                  background-color: #ffffff;
                  border-radius: 12px;
                  overflow: hidden;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                ">

                  <!-- Header -->
                  <tr>
                    <td style="
                      background-color: #e91e8c;
                      padding: 30px;
                      text-align: center;
                    ">
                      <h1 style="
                        color: #ffffff;
                        margin: 0;
                        font-size: 28px;
                        letter-spacing: 1px;
                      ">🌸 Pregna Care</h1>
                      <p style="
                        color: #fce4ec;
                        margin: 6px 0 0;
                        font-size: 14px;
                      ">Your pregnancy companion</p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="
                        color: #333333;
                        font-size: 16px;
                        margin: 0 0 10px;
                      ">Hello,</p>

                      <p style="
                        color: #555555;
                        font-size: 15px;
                        line-height: 1.6;
                        margin: 0 0 30px;
                      ">
                        Use the OTP below to
                        <strong>${actionText}</strong>.
                        This code is valid for <strong>5 minutes</strong>.
                      </p>

                      <!-- OTP Box -->
                      <div style="
                        background-color: #fce4ec;
                        border-radius: 8px;
                        padding: 20px;
                        text-align: center;
                        margin-bottom: 30px;
                      ">
                        <p style="
                          margin: 0 0 8px;
                          font-size: 13px;
                          color: #888888;
                          text-transform: uppercase;
                          letter-spacing: 1px;
                        ">Your OTP</p>
                        <h2 style="
                          margin: 0;
                          font-size: 42px;
                          letter-spacing: 12px;
                          color: #e91e8c;
                          font-weight: bold;
                        ">${otp}</h2>
                      </div>

                      <!-- Warning -->
                      <div style="
                        background-color: #fff8e1;
                        border-left: 4px solid #ffc107;
                        border-radius: 4px;
                        padding: 12px 16px;
                        margin-bottom: 30px;
                      ">
                        <p style="
                          margin: 0;
                          font-size: 13px;
                          color: #7a6000;
                        ">
                          ⚠️ Never share this OTP with anyone.
                          Pregna Care will never ask for your OTP.
                        </p>
                      </div>

                      <p style="
                        color: #888888;
                        font-size: 13px;
                        line-height: 1.5;
                        margin: 0;
                      ">
                        If you did not request this OTP, please ignore
                        this email or contact support immediately.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="
                      background-color: #f5f5f5;
                      padding: 20px 30px;
                      text-align: center;
                      border-top: 1px solid #eeeeee;
                    ">
                      <p style="
                        margin: 0;
                        font-size: 12px;
                        color: #aaaaaa;
                      ">
                        © ${new Date().getFullYear()} Pregna Care. All rights reserved.
                      </p>
                      <p style="
                        margin: 6px 0 0;
                        font-size: 12px;
                        color: #aaaaaa;
                      ">
                        This is an automated email. Please do not reply.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
}

}