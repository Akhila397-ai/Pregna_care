import mongoose, { Schema } from "mongoose";
;
const AvailabilitySchema = new Schema({
    days: { type: [String], required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
}, { _id: false });
const DoctorApplicationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    specialization: {
        type: String,
        required: true,
    },
    qualification: {
        type: String,
        required: true
    },
    registrationNumber: {
        type: String,
        required: true
    },
    consultationFee: {
        type: Number,
        required: true
    },
    clinicName: {
        type: String,
        required: true
    },
    clinicAddress: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true,
        min: 0
    },
    profileImage: {
        type: String,
        required: true
    },
    availability: {
        type: AvailabilitySchema,
        required: true
    },
    status: {
        type: String,
        enum: [
            'pending',
            'under_review',
            'approved',
            'rejected',
            'more_documents_required',
        ],
        default: 'pending',
    },
    verificationRemarks: {
        type: String
    },
    verifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    verifiedAt: {
        type: Date
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    degreeCertificateUrl: {
        type: String,
        required: true
    },
    registrationCertificateUrl: {
        type: String,
        required: true
    },
    governmentIdUrl: {
        type: String,
        required: true
    },
}, { timestamps: true });
export default mongoose.models.DoctorApplication ||
    mongoose.model('DoctorApplication', DoctorApplicationSchema);
//# sourceMappingURL=doctorApplication.model.js.map