export interface Availability {
    days: string[];
    startTime: string;
    endTime:string;
}





//DTOs
export interface DoctorApplyRequest {
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
  id:                 string;
  userId:             string;
  specialization:     string;
  qualification:      string;
  experience:         number;
  registrationNumber: string;
  consultationFee:    number;
  clinicName:         string;
  clinicAddress:      string;
  profileImage:       string;
  documents:          string[];
  availability:       Availability;
  status:             DoctorStatus;
  rejectionReason?:   string;
  approvedBy?:        string;
  approvedAt?:        string;
  createdAt?:         string;
}
export interface DoctorDashboardResponse {
  application: DoctorApplicationResponse;
  name:        string;
  email:       string;
  phone?:      string;
  imageUrl?:   string;
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
    application: DoctorApplicationResponse;
}

export interface DoctorStatusResponse {
    status:   DoctorStatus;
    application: DoctorApplicationResponse;
    name: string;
    rejectionReason?: string;
}