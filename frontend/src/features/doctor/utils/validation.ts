
export interface DoctorApplyErrors {
    fullName?:  string;
    email?: string;
    password?: string;
    phone?: string;
    specialization?: string;
    qualification?: string;
    experience?:         string;
    registrationNumber?: string;
    consultationFee?:    string;
    clinicName?:         string;
    clinicAddress?:      string;
    profileImage?:       string;
    documents?:          string;
    availabilityDays?:   string;
    startTime?:          string;
    endTime?:            string;
}

export const validateDoctorApply = (
    data: Record<string, any>
): DoctorApplyErrors => {

    const errors: DoctorApplyErrors = {};

  if (!data.fullName?.trim())
    errors.fullName = 'Full name is required.';

  if (!data.email?.trim())
    errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = 'Please enter a valid email.';
  if (!data.password)
    errors.password = 'Password is required.';
  else if (data.password.length < 8)
    errors.password = 'Password must be at least 8 characters.';

  if (!data.phone?.trim())
    errors.phone = 'Phone number is required.';

  if (!data.specialization?.trim())
    errors.specialization = 'Specialization is required.';

  if (!data.qualification?.trim())
    errors.qualification = 'Qualification is required.';
  
   if (!data.experience && data.experience !== 0)
    errors.experience = 'Experience is required.';
  else if (data.experience < 0)
    errors.experience = 'Experience cannot be negative.';

  if (!data.registrationNumber?.trim())
    errors.registrationNumber = 'Medical registration number is required.';

  if (!data.consultationFee && data.consultationFee !== 0)
    errors.consultationFee = 'Consultation fee is required.';
  else if (data.consultationFee < 0)
    errors.consultationFee = 'Fee cannot be negative.';

   if (!data.clinicName?.trim())
    errors.clinicName = 'Clinic/Hospital name is required.';

  if (!data.clinicAddress?.trim())
    errors.clinicAddress = 'Clinic address is required.';

  if (!data.profileImage?.trim())
    errors.profileImage = 'Profile image is required.';

  if (!data.documents || data.documents.length === 0)
    errors.documents = 'Please upload at least one document.';

   if (!data.availability?.days || data.availability.days.length === 0)
    errors.availabilityDays = 'Please select at least one available day.';

  if (!data.availability?.startTime)
    errors.startTime = 'Start time is required.';

  if (!data.availability?.endTime)
    errors.endTime = 'End time is required.';

  return errors;

}

export const hasErrors = (errors: object): boolean => {
    return Object.keys(errors).length> 0
}