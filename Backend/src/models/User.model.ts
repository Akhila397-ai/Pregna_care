import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/IUser.js";
import { Role } from "../enums/role.enum.js";
import { UserStatus } from "../enums/userStatus.enum.js";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.PATIENT
    },

    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE
    },

    isVerified: { type: Boolean, default: false },

    otp: String,
    otpExpiry: Date,
    otpRequestedAt: { type: Date, default: null },   
    otpAttempts: { type: Number, default: 0 }, 
    lastLogin: Date
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);