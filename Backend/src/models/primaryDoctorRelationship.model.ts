import mongoose, { Schema, Document } from "mongoose";

export type RelationshipEvent =
  | 'PRIMARY_REQUESTED'
  | 'PRIMARY_ACCEPTED'
  | 'PRIMARY_DECLINED'
  | 'PRIMARY_CANCELLED'
  | 'PRIMARY_CHANGED'
  | 'PRIMARY_ENDED';

export interface IRelationshipHistoryItem {
  event: RelationshipEvent;
  timestamp: Date;
  note?: string;
}

export interface IPrimaryDoctorRelationshipDocument extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  doctorApplicationId: mongoose.Types.ObjectId;
  status: 'pending' | 'active' | 'declined' | 'cancelled' | 'ended';
  requestedAt: Date;
  respondedAt?: Date;
  endedAt?: Date;
  rejectionReason?: string;
  history: IRelationshipHistoryItem[];
  createdAt: Date;
  updatedAt: Date;
}

const RelationshipHistorySchema = new Schema<IRelationshipHistoryItem>(
  {
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
  },
  { _id: false }
);

const PrimaryDoctorRelationshipSchema = new Schema<IPrimaryDoctorRelationshipDocument>(
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
  },
  { timestamps: true }
);

export default (mongoose.models.PrimaryDoctorRelationship as mongoose.Model<IPrimaryDoctorRelationshipDocument>) ||
  mongoose.model<IPrimaryDoctorRelationshipDocument>(
    'PrimaryDoctorRelationship',
    PrimaryDoctorRelationshipSchema
  );
