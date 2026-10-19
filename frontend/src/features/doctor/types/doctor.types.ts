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

export interface VerifiedDoctor {
    id: string;
    userId: string;
    name: string;
    fullName: string;
    specialization: string;
    qualification: string;
    experience: number;
    registrationNumber: string;
    consultationFee: number;
    clinicName: string;
    clinicAddress: string;
    profileImage?: string;
    availability: Availability;
    isVerified: boolean;
    phone?: string;
}

export interface GetVerifiedDoctorsResponse {
    doctors: VerifiedDoctor[];
    total: number;
}

// ── Appointments ─────────────────────────────
export type AppointmentStatus =
  | 'scheduled'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export interface Appointment {
  id: string;
  patientId: string;
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
  patientOnboardingType?: string;
  patientPregnancyWeek?: number;
  patientTrimester?: number;
  doctorId: string;
  doctorName?: string;
  doctorSpecialization?: string;
  doctorQualification?: string;
  doctorClinicName?: string;
  doctorClinicAddress?: string;
  doctorProfileImage?: string;
  appointmentDate: string;
  timeSlot: string;
  reason?: string;
  status: AppointmentStatus;
  consultationNotes?: string;
  prescription?: string;
  cancelledBy?: 'patient' | 'doctor' | 'admin';
  cancelReason?: string;
  completedAt?: string;
  createdAt?: string;
}

export interface BookAppointmentRequest {
  doctorId: string;
  appointmentDate: string;
  timeSlot: string;
  reason?: string;
}

export interface CompleteAppointmentRequest {
  consultationNotes?: string;
  prescription?: string;
}

export interface CancelAppointmentRequest {
  cancelReason?: string;
}

// ── Primary Doctor Relationships ─────────────
export type PrimaryDoctorStatusType =
  | 'pending'
  | 'active'
  | 'declined'
  | 'ended';

export interface PrimaryDoctorRelationship {
  id: string;
  patientId: string;
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
  patientOnboardingType?: string;
  patientPregnancyWeek?: number;
  patientTrimester?: number;
  doctorId: string;
  doctorName?: string;
  doctorSpecialization?: string;
  doctorQualification?: string;
  doctorClinicName?: string;
  doctorClinicAddress?: string;
  doctorProfileImage?: string;
  status: PrimaryDoctorStatusType;
  requestedAt?: string;
  acceptedAt?: string;
  declinedAt?: string;
  endedAt?: string;
  declineReason?: string;
  history?: Array<{
    event: string;
    timestamp: string;
    note?: string;
    previousDoctorName?: string;
  }>;
}

export interface PatientPrimaryDoctorStatus {
  hasPrimaryDoctor: boolean;
  hasPendingRequest: boolean;
  primaryDoctor?: VerifiedDoctor;
  pendingDoctor?: VerifiedDoctor;
  relationship?: PrimaryDoctorRelationship;
}

export interface RespondPrimaryDoctorRequest {
  action: 'accept' | 'decline';
  reason?: string;
}

// ── Doctor Reports ───────────────────────────
export type DoctorReportReason =
  | 'unprofessional_behavior'
  | 'missed_appointment'
  | 'incorrect_prescription'
  | 'billing_issue'
  | 'other';

export type DoctorReportStatus =
  | 'pending'
  | 'reviewed'
  | 'resolved'
  | 'dismissed';

export interface DoctorReport {
  id: string;
  patientId: string;
  patientName?: string;
  doctorId: string;
  doctorName?: string;
  appointmentId?: string;
  reason: DoctorReportReason;
  description: string;
  status: DoctorReportStatus;
  adminRemarks?: string;
  createdAt?: string;
}

export interface SubmitDoctorReportRequest {
  doctorId: string;
  appointmentId?: string;
  reason: DoctorReportReason;
  description: string;
}
