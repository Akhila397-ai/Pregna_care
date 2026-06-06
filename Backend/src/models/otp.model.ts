import mongoose,{Schema, Document} from "mongoose";
import { otpData } from "../types/otp.js";
import { isBooleanObject } from "node:util/types";

export interface IOTPDocument extends otpData, Document {};


const OTPSchema = new Schema<IOTPDocument>(
    {
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
            enum: ['signup','login','forgot_password','resend_otp'],
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
            default: Date.now, expires: 300
        }
    }
);

OTPSchema.index({ userId: 1, purpose: 1, isUsed: 1})

export default mongoose.model<IOTPDocument>('OTP',OTPSchema)