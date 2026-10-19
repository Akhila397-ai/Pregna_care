import mongoose, { Schema, Document } from "mongoose";

export interface IAppointmentDocument extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  doctorApplicationId: mongoose.Types.ObjectId;
  appointmentDate: Date;
  timeSlot: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  reason?: string;
  consultationNotes?: string;
  prescription?: string;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointmentDocument>(
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
    doctorApplicationId: {
      type: Schema.Types.ObjectId,
      ref: 'DoctorApplication',
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
      index: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    consultationNotes: {
      type: String,
      trim: true,
    },
    prescription: {
      type: String,
      trim: true,
    },
    completedAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    cancelReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Prevent double bookings for same doctor on same date & time slot for active scheduled appointments
AppointmentSchema.index(
  { doctorId: 1, appointmentDate: 1, timeSlot: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'scheduled' },
  }
);

export default (mongoose.models.Appointment as mongoose.Model<IAppointmentDocument>) ||
  mongoose.model<IAppointmentDocument>('Appointment', AppointmentSchema);
