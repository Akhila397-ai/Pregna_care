import mongoose, { Schema } from "mongoose";
const RelationshipHistorySchema = new Schema({
    event: {
        type: String,
        enum: [
            'PRIMARY_REQUESTED',
            'PRIMARY_ACCEPTED',
            'PRIMARY_DECLINED',
            'PRIMARY_CANCELLED',
            'PRIMARY_CHANGED',
            'PRIMARY_ENDED',
        ],
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    note: {
        type: String,
        trim: true,
    },
}, { _id: false });
const PrimaryDoctorRelationshipSchema = new Schema({
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
    doctorApplicationId: {
        type: Schema.Types.ObjectId,
        ref: 'DoctorApplication',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'declined', 'cancelled', 'ended'],
        default: 'pending',
        index: true,
    },
    requestedAt: {
        type: Date,
        default: Date.now,
    },
    respondedAt: {
        type: Date,
    },
    endedAt: {
        type: Date,
    },
    rejectionReason: {
        type: String,
        trim: true,
    },
    history: {
        type: [RelationshipHistorySchema],
        default: [],
    },
}, { timestamps: true });
export default mongoose.models.PrimaryDoctorRelationship ||
    mongoose.model('PrimaryDoctorRelationship', PrimaryDoctorRelationshipSchema);
//# sourceMappingURL=primaryDoctorRelationship.model.js.map