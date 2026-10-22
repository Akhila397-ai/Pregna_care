import mongoose, { Schema } from "mongoose";
import { OTP_EXPIRY_SECONDS } from "../constants/otp.constant.js";
const OTPSchema = new Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    otpHash: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        enum: ['signup', 'login', 'forgot_password', 'resend_otp'],
        required: true
    },
    attempts: {
        type: Number,
        default: 0
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: OTP_EXPIRY_SECONDS,
    }
});
OTPSchema.index({ userId: 1, purpose: 1, isUsed: 1 });
export default mongoose.model('OTP', OTPSchema);
//# sourceMappingURL=otp.model.js.map