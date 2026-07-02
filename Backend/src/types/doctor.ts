import { Types } from "mongoose";

export type DoctorStatus = 'pending' | 'approved' | 'rejected';

export interface Availability {
     days: string[];
     startTime: string;
     endTime: string;
}


export interface doctorApplicationData {
    userId: Types.ObjectId;
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
    isDeleted: boolean;

}
export type ApplicationStatusUpdate = {
  status: "approved" | "rejected" | 'pending';
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  rejectionReason?: string;
};


export interface DoctorApplicationWithUser {
  application: DoctorApplicationDocument;
  user: {
    _id:        Types.ObjectId;
    name:       string;
    email:      string;
    phone?:     string;
    imageUrl?:  string;
    isBlocked:  boolean;
    isVerified: boolean;
    isDeleted:  boolean;
  };
}
export type DoctorApplicationDocument = 
doctorApplicationData & { _id: Types.ObjectId};