import mongoose, { Schema } from "mongoose";
;
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String
    },
    fullName: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    refreshTokenHash: {
        type: String,
        select: false,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'doctor'],
        default: 'user',
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    imageUrl: {
        type: String
    },
    isOnboarded: {
        type: Boolean,
        default: false,
    },
    onboardingType: {
        type: String,
        enum: ['pregnant', 'trying', 'doctor', 'exploring', null],
        default: null,
    },
    lmpDate: {
        type: Date,
        default: null,
    },
    periodStartDate: {
        type: Date,
        default: null,
    },
    cycleLength: {
        type: Number,
        default: 28,
    },
    periodLength: {
        type: Number,
        default: 5,
    },
    emergencyContacts: [
        {
            name: {
                type: String,
                required: true,
                trim: true,
            },
            phoneNumber: {
                type: String,
                required: true,
                trim: true,
            },
            relationship: {
                type: String,
                required: true,
                enum: [
                    'Parent',
                    'Husband / Spouse',
                    'Partner',
                    'Family Member',
                    'Friend',
                    'Other',
                ],
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    primaryDoctorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    refreshToken: {
        type: String,
        select: false
    },
}, { timestamps: true });
export default mongoose.models.User || mongoose.model('User', UserSchema);
//# sourceMappingURL=User.model.js.map