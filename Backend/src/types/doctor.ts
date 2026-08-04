import { Types } from "mongoose";

export type DoctorStatus =
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'more_documents_required';

export interface Availability {
     days: string[];
     startTime: string;
     endTime: string;
}


export interface doctorApplicationData {
  
    userId: Types.ObjectId;
    fullName: string;
    specialization:  string;
    qualification:   string;
    experience:      number;
    registrationNumber: string;
    consultationFee:  number;
    clinicName:  string;
    clinicAddress: string;
    availability: Availability;

    profileImage: string;

     // ── Documents (S3 keys) ───────────────────
  degreeCertificateUrl:       string;
  registrationCertificateUrl: string;
  governmentIdUrl:            string;

  // ── Verification ──────────────────────────
  status:               DoctorStatus;
  verificationRemarks?: string;
  verifiedBy?:          Types.ObjectId;
  verifiedAt?:          Date;
  
   // ── Flags ─────────────────────────────────
  isBlocked:  boolean;
  isDeleted:  boolean;

  // ← NO isVerified here — that lives on User model

  createdAt?: Date;
  updatedAt?: Date;
  
    

}
export type DoctorApplicationDocument = 
doctorApplicationData & { _id: Types.ObjectId};

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
    fullName: string;
    phone?:     string;
    imageUrl?:  string;
    isBlocked:  boolean;
    isVerified: boolean;
    isDeleted:  boolean;
  };
}
