import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const user = process.env.EMAIL_USER?.trim();
const pass = process.env.EMAIL_PASS?.replace(/\s+/g, '');
const host = process.env.EMAIL_HOST?.trim();
const port = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : undefined;
const secure = process.env.EMAIL_SECURE === 'true' || port === 465;
console.log('==========================================');
console.log('EMAIL CONFIGURATION INSPECTION');
console.log('==========================================');
console.log('EMAIL_USER:', user);
console.log('EMAIL_HOST:', host || '(defaulting to Gmail service)');
console.log('EMAIL_PASS length:', pass ? pass.length : 0);
if (!user || !pass) {
    console.error('❌ Missing EMAIL_USER or EMAIL_PASS in .env');
    process.exit(1);
}
const transporter = host
    ? nodemailer.createTransport({
        host,
        port: port || 587,
        secure,
        auth: { user, pass },
    })
    : nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
    });
async function runTest() {
    console.log('\n1. Verifying SMTP Server Connection...');
    try {
        await transporter.verify();
        console.log('✅ SMTP Connection & Authentication SUCCESSFUL!');
    }
    catch (err) {
        console.error('❌ SMTP Verification FAILED:', err.message);
        return;
    }
    console.log(`\n2. Attempting to send a real test email to ${user}...`);
    try {
        const info = await transporter.sendMail({
            from: user,
            to: user,
            subject: '🌸 Pregna Care Email Service Test',
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e91e8c; border-radius: 8px;">
          <h2 style="color: #e91e8c;">🌸 Pregna Care Email Service is Working!</h2>
          <p>This is a real test email to confirm your SMTP configuration is successfully delivering OTPs to inboxes.</p>
          <p><strong>Status:</strong> Online & Active</p>
        </div>
      `,
        });
        console.log('🎉 EMAIL DELIVERED SUCCESSFULLY!');
        console.log('Message ID:', info.messageId);
        console.log(`Check the inbox for ${user} to see the test email.`);
    }
    catch (err) {
        console.error('❌ Failed to deliver email:', err.message);
    }
}
runTest();
//# sourceMappingURL=test-email.js.map