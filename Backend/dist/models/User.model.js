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
    onboardingType: {
        type: String,
        enum: ['pregnant', 'trying', 'doctor', 'exploring', null],
        default: null,
    }
}, { timestamps: true });
export default mongoose.models.User || mongoose.model('User', UserSchema);
//# sourceMappingURL=User.model.js.map