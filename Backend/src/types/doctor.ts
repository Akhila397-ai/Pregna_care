import { Types } from "mongoose";

export type DoctorStatus = 'pending' | 'approved' | 'rejected';

export interface Availability {
     days: string[];
  startTime: string;
  endTime: string;
}


export interface doctorApplicationData {
    userId:    Types.ObjectId;
    fullName:  string;
    email:     string;
    phone:     string;
    specialization:  string;
    qualification:   string;
    experience:      number;
    registrationNumber: string;
    consultationFee:  number;
    clinicName:  string;
    clinicAddress: string;
    profileImage: string;
    availability: Availability;
    status:       DoctorStatus;
    rejectionReason?: string;
    approvedBy?:   Types.ObjectId;
    approvedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    documents: string[];
    isBlocked: boolean;
    isVerified: boolean;
    isDeleted: boolean

}
export type ApplicationStatusUpdate = {
  status: "approved" | "rejected";
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  rejectionReason?: string;
};

//Doctor profile(created after admin approvrd the request)

export interface doctorProfileData {
    userId:    Types.ObjectId;
    applicationId: Types.ObjectId;
    fullName:  string;
    email: string;
    phone: string;
    specialization: string;
    qualification: string;
    experience: number;
    registrationNumber: string;
    consultationFee : number;
    clinicName:  string;
    clinicAddress:  string;
    profileImage: string;
    documents: string[];
    availability:  Availability;
    isActive:  boolean;
    createdAt: Date;
    updatedAt?:  Date;
}

export type DoctorApplicationDocument = 
doctorApplicationData & { _id: Types.ObjectId};