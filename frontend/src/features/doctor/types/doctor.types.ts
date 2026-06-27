export interface Availability {
    days: string[];
    startTime: string;
    endTime:string;
}



//DTOs
export interface DoctorApplyRequest {
    fullName:   string;
    email:      string;
    password:   string;
    phone:      string;
    specialization: string;
    qualification:  string;
    experience:  number;
    registrationNumber: string;
    consultationFee: number;
    clinicName:  string;
    clinicAddress:  string;
    profileImage:  string;
    documents: string[];
    availability:  Availability;
}


//Response
export type DoctorStatus = 'pending' | 'approved' | 'rejected';

export interface DoctorApplicationResponse {
    id:     string;
    userId: string;
    fullName: string;
    email:   string;
    phone:   string;
    specialization: string;
    qualification: string;
    experience:  number;
    registrationNumber:  string;
    consultationFee: number;
    clinicName: string;
    clinicAddress:  string;
    profileImage: string;
    documents:  string[];
    availability:  Availability;
    status: DoctorStatus;
    rejectionReason?: string;
    approvedBy?:  string;
    approvedAt?:  string;
    createdAt?: string;

}

export interface DoctorProfileResponse {
    id:      string;
    userId:  string;
    applicationId:  string;
    fullName:  string;
    email: string;
    phone: string;
    specialization: string;
    qualification: string;
    experience:  number;
    registrationNumber: string;
    consultationFee: number;
    clinicName:  string;
    clinicAddress: string;
    profileImage:  string;
    documents: string[];
    availability: Availability;
    isActive: boolean;
    createdAt?:  string 
}

export interface DoctorApplyResponse  {
    message:   string;
    token:  string;
    application: DoctorApplicationResponse;
}

export interface DoctorStatusResponse {
    status:   DoctorStatus;
    application: DoctorApplicationResponse;
    rejectionReason?: string;
}