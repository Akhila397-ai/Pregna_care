import mongoose, { Schema } from "mongoose";
const DoctorReportSchema = new Schema({
    patientId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    appointmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Appointment',
    },
    reason: {
        type: String,
        enum: [
            'unprofessional_behavior',
            'missed_appointment',
            'incorrect_prescription',
            'billing_issue',
            'other',
        ],
        required: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['submitted', 'under_investigation', 'resolved'],
        default: 'submitted',
        index: true,
    },
    adminRemarks: {
        type: String,
        trim: true,
    },
    resolvedAt: {
        type: Date,
    },
    resolvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });
export default mongoose.models.DoctorReport ||
    mongoose.model('DoctorReport', DoctorReportSchema);
//# sourceMappingURL=doctorReport.model.js.map