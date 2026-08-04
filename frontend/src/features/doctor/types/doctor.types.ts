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
    availability:  Availability;
}


//Response
export type DoctorStatus =
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'more_documents_required';

export interface DoctorApplicationResponse {
  id:                 string;
  userId:             string;
  fullName:           string;
  specialization:     string;
  qualification:      string;
  experience:         number;
  registrationNumber: string;
  consultationFee:    number;
  clinicName:         string;
  clinicAddress:      string;
  profileImage?:       string;
  availability:       Availability;
  degreeCertificateUrl?:       string;
  registrationCertificateUrl?: string;
  governmentIdUrl?:            string;
  status:             DoctorStatus;
  verificationRemarks?: string;
  verifiedBy?:          string;
  verifiedAt?:          string;
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
    name:  string;
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
    verificationRemarks?: string;
}

export interface DoctorApplyFormData {
    fullName:  string;
    specialization:  string;
    qualification: string;
    experience:  number;
    registrationNumber: string;
    consultationFee: number;
    clinicName: string;
    clinicAddress: string;
    availability: Availability;
    degreeCertificate: File | null;
    registrationCertificate: File | null;
    governmentId:   File | null;
    profileImage: File | null;

}