import mongoose, {Schema, Document} from "mongoose";
import { doctorProfileData } from "../types/doctor.js";


export interface IDoctorApplicationDocument extends doctorProfileData, Document {}

const AvailabilitySchema = new Schema (
    {
        days:  {
            type: [String],
            required: true
        },
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: true
        }
    },
    {_id: false}
);

const DoctorProfileSchema = new Schema<IDoctorApplicationDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        applicationId: {
            type: Schema.Types.ObjectId,
            ref: 'DoctorApplication',
            required: true
            
        },
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        specialization: {
            type: String,
            required: true
        },
        qualification: {
            type: String,
            required: true
        },
        experience: {
            type: Number,
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
        profileImage: {
            type: String,
            required: true
        },
        documents: {
            type: [String],
            required: true
        },
        availability: {
            type: AvailabilitySchema,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        }

    },
    { timestamps: true}
);

export default  mongoose.model<IDoctorApplicationDocument>(
    'DoctorProfile',
    DoctorProfileSchema
)