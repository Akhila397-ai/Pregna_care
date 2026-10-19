import { DoctorStatus, Availability } from "../types/doctor.js";


export interface DoctorApplyDTO {
    fullName: string;
    specialization:  string;
    qualification:   string;
    experience:      number;
    registrationNumber:  string;
    consultationFee: number;
    clinicName: string;
    clinicAddress: string;
    availability: {
        days:  string[];
        startTime: string;
        endTime:  string;
    };
}

export interface DoctorApplicationDTO {
    id:  string;
    userId: string;
    fullName: string;
    specialization: string;
    qualification: string;
    experience: number;
    registrationNumber: string;
    consultationFee: number;
    clinicName: string;
    clinicAddress: string;
    profileImage: string;
    availability: Availability;
    degreeCertificateUrl?:       string;
    registrationCertificateUrl?: string;
    governmentIdUrl?:            string;
    status:  DoctorStatus;
    verificationRemarks?: string;
    verifiedBy?:          string;
    verifiedAt?:          Date;

    createdAt?: Date;
}
export interface RejectDoctorDTO {
    rejectionReason:  string;
}

export interface DoctorDashboardDTO {
  application:        DoctorApplicationDTO;
  name:               string;    // ← from User
  email:              string;
  phone?:             string;
  imageUrl?:          string;
}
export interface DoctorProfileDTO {
    id: string;
    userId: string;
    applicationId: string;
    fullName: string;
    email: string;
    phone: string;
    specialiazation: string;
    qualification: string;
    experience: number;
    registrationNumber: string;
    consultationFee: number;
    clinicName:  string;
    clinicAddress: string;
    profileImage: string;
    documents: string[];
    availability: Availability;
    isActive: boolean;
    createdAt?:  Date;
}

export interface DoctorApplyResponseDTO {
    message: string;
    application: DoctorApplicationDTO
}

export interface DoctorStatusResponseDTO {
    status:   DoctorStatus;
    application: DoctorApplicationDTO;
    name: string;
    verificationRemarks?: string;
}

export interface VerifiedDoctorDTO {
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

export interface GetVerifiedDoctorsResponseDTO {
    doctors: VerifiedDoctorDTO[];
    total: number;
}

export interface BookAppointmentDTO {
    doctorId: string;
    appointmentDate: string;
    timeSlot: string;
    reason?: string;
}

export interface CompleteAppointmentDTO {
    consultationNotes?: string;
    prescription?: string;
}

export interface CancelAppointmentDTO {
    cancelReason?: string;
}

export interface AppointmentDTO {
    id: string;
    patientId: string;
    doctorId: string;
    doctorApplicationId: string;
    appointmentDate: Date;
    timeSlot: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    reason?: string;
    consultationNotes?: string;
    prescription?: string;
    completedAt?: Date;
    cancelledAt?: Date;
    cancelReason?: string;
    patientName?: string;
    patientEmail?: string;
    patientPhone?: string;
    patientOnboardingType?: string;
    patientPregnancyWeek?: number;
    patientTrimester?: number;
    doctorName?: string;
    doctorSpecialization?: string;
    doctorClinicName?: string;
    doctorProfileImage?: string;
    doctor?: VerifiedDoctorDTO;
    patient?: {
        id: string;
        name: string;
        email: string;
        phone?: string;
        fullName?: string;
        onboardingType?: string;
        lmpDate?: Date;
    };
    createdAt: Date;
}

export interface RequestPrimaryDoctorDTO {
    doctorId: string;
}

export interface RespondPrimaryDoctorRequestDTO {
    action: 'accept' | 'decline';
    reason?: string;
}

export interface PrimaryDoctorRelationshipDTO {
    id: string;
    patientId: string;
    doctorId: string;
    status: 'pending' | 'active' | 'declined' | 'cancelled' | 'ended';
    requestedAt: Date;
    respondedAt?: Date;
    endedAt?: Date;
    rejectionReason?: string;
    patientName?: string;
    patientEmail?: string;
    patientPhone?: string;
    patientOnboardingType?: string;
    patientPregnancyWeek?: number;
    patientTrimester?: number;
    doctorName?: string;
    doctorSpecialization?: string;
    doctorClinicName?: string;
    doctorProfileImage?: string;
    doctor?: VerifiedDoctorDTO;
    patient?: {
        id: string;
        name: string;
        email: string;
        phone?: string;
        fullName?: string;
        onboardingType?: string;
        lmpDate?: Date;
    };
    history?: {
        event: string;
        timestamp: Date;
        note?: string;
    }[];
}

export interface PatientPrimaryDoctorStatusDTO {
    status: 'none' | 'pending' | 'active';
    primaryDoctor?: VerifiedDoctorDTO;
    pendingRequest?: {
        id: string;
        doctor: VerifiedDoctorDTO;
        requestedAt: Date;
    };
    relationshipId?: string;
}

export interface SubmitDoctorReportDTO {
    doctorId: string;
    appointmentId?: string;
    reason: 'unprofessional_behavior' | 'missed_appointment' | 'incorrect_prescription' | 'billing_issue' | 'other';
    description: string;
}

export interface DoctorReportDTO {
    id: string;
    patientId: string;
    doctorId: string;
    appointmentId?: string;
    reason: string;
    description: string;
    status: 'submitted' | 'under_investigation' | 'resolved';
    adminRemarks?: string;
    patientName?: string;
    doctorName?: string;
    createdAt: Date;
}