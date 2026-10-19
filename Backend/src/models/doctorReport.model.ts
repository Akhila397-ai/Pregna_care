import mongoose, { Schema, Document } from "mongoose";

export type DoctorReportReason =
  | 'unprofessional_behavior'
  | 'missed_appointment'
  | 'incorrect_prescription'
  | 'billing_issue'
  | 'other';

export interface IDoctorReportDocument extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  appointmentId?: mongoose.Types.ObjectId;
  reason: DoctorReportReason;
  description: string;
  status: 'submitted' | 'under_investigation' | 'resolved';
  adminRemarks?: string;
  resolvedAt?: Date;
  resolvedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorReportSchema = new Schema<IDoctorReportDocument>(
  {
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
  },
  { timestamps: true }
);

export default (mongoose.models.DoctorReport as mongoose.Model<IDoctorReportDocument>) ||
  mongoose.model<IDoctorReportDocument>('DoctorReport', DoctorReportSchema);
