export const toDoctorApplicationDTO = (app, presignedUrls = {}) => ({
    id: app._id.toString(),
    userId: app.userId.toString(),
    fullName: app.fullName,
    specialization: app.specialization,
    qualification: app.qualification,
    experience: app.experience,
    registrationNumber: app.registrationNumber,
    consultationFee: app.consultationFee,
    clinicName: app.clinicName,
    clinicAddress: app.clinicAddress,
    profileImage: app.profileImage,
    availability: app.availability,
    degreeCertificateUrl: presignedUrls.degreeCertificateUrl,
    registrationCertificateUrl: presignedUrls.registrationCertificateUrl,
    governmentIdUrl: presignedUrls.governmentIdUrl,
    status: app.status,
    verificationRemarks: app.verificationRemarks,
    verifiedBy: app.verifiedBy?.toString(),
    verifiedAt: app.verifiedAt,
    createdAt: app.createdAt,
});
export const toDoctorDashboardDTO = ({ application, user }, presignedUrls = {}) => ({
    application: toDoctorApplicationDTO(application, presignedUrls),
    name: user.name,
    email: user.email,
    phone: user.phone,
    imageUrl: user.imageUrl,
});
export const toDoctorStatusDTO = ({ application, user }, presignedUrls = {}) => ({
    status: application.status,
    application: toDoctorApplicationDTO(application, presignedUrls),
    name: user.name,
    verificationRemarks: application.verificationRemarks,
});
export const toVerifiedDoctorDTO = ({ application, user }, profileImageUrl) => ({
    id: application._id.toString(),
    userId: user._id.toString(),
    name: user.name || application.fullName,
    fullName: application.fullName,
    specialization: application.specialization,
    qualification: application.qualification,
    experience: application.experience,
    registrationNumber: application.registrationNumber,
    consultationFee: application.consultationFee,
    clinicName: application.clinicName,
    clinicAddress: application.clinicAddress,
    profileImage: profileImageUrl || application.profileImage,
    availability: application.availability,
    isVerified: true,
    phone: user.phone,
});
export const toAppointmentDTO = (doc) => {
    const patientDoc = doc.patientId && typeof doc.patientId === 'object' && doc.patientId._id ? doc.patientId : null;
    const patient = patientDoc ? {
        id: patientDoc._id.toString(),
        name: patientDoc.name || patientDoc.fullName,
        email: patientDoc.email,
        phone: patientDoc.phone,
        fullName: patientDoc.fullName,
        onboardingType: patientDoc.onboardingType,
        lmpDate: patientDoc.lmpDate,
    } : undefined;
    let patientPregnancyWeek;
    let patientTrimester;
    if (patientDoc?.lmpDate) {
        const lmpTime = new Date(patientDoc.lmpDate).getTime();
        const now = new Date().getTime();
        const diffDays = Math.max(0, Math.floor((now - lmpTime) / (1000 * 60 * 60 * 24)));
        patientPregnancyWeek = Math.floor(diffDays / 7);
        patientTrimester = patientPregnancyWeek < 13 ? 1 : patientPregnancyWeek < 28 ? 2 : 3;
    }
    const docApp = doc.doctorApplicationId && typeof doc.doctorApplicationId === 'object' ? doc.doctorApplicationId : null;
    const docUser = doc.doctorId && typeof doc.doctorId === 'object' ? doc.doctorId : null;
    const doctor = docApp ? {
        id: docApp._id ? docApp._id.toString() : '',
        userId: docUser?._id ? docUser._id.toString() : (doc.doctorId ? doc.doctorId.toString() : ''),
        name: docUser?.name || docApp.fullName,
        fullName: docApp.fullName,
        specialization: docApp.specialization,
        qualification: docApp.qualification || '',
        experience: docApp.experience || 0,
        registrationNumber: docApp.registrationNumber || '',
        consultationFee: docApp.consultationFee || 0,
        clinicName: docApp.clinicName,
        clinicAddress: docApp.clinicAddress || '',
        profileImage: docApp.profileImage,
        availability: docApp.availability,
        isVerified: true,
        phone: docUser?.phone,
    } : undefined;
    return {
        id: doc._id.toString(),
        patientId: doc.patientId?._id ? doc.patientId._id.toString() : (doc.patientId?.toString() || ''),
        doctorId: doc.doctorId?._id ? doc.doctorId._id.toString() : (doc.doctorId?.toString() || ''),
        doctorApplicationId: doc.doctorApplicationId?._id ? doc.doctorApplicationId._id.toString() : (doc.doctorApplicationId?.toString() || ''),
        appointmentDate: doc.appointmentDate,
        timeSlot: doc.timeSlot,
        status: doc.status,
        reason: doc.reason,
        consultationNotes: doc.consultationNotes,
        prescription: doc.prescription,
        completedAt: doc.completedAt,
        cancelledAt: doc.cancelledAt,
        cancelReason: doc.cancelReason,
        createdAt: doc.createdAt,
        patientName: patient?.name || patient?.fullName || 'Patient',
        patientEmail: patient?.email,
        patientPhone: patient?.phone,
        patientOnboardingType: patient?.onboardingType,
        patientPregnancyWeek,
        patientTrimester,
        doctorName: doctor?.fullName || doctor?.name,
        doctorSpecialization: doctor?.specialization,
        doctorClinicName: doctor?.clinicName,
        doctorClinicAddress: doctor?.clinicAddress,
        doctorProfileImage: doctor?.profileImage,
        patient,
        doctor,
    };
};
export const toPrimaryDoctorRelationshipDTO = (doc) => {
    const patientDoc = doc.patientId && typeof doc.patientId === 'object' && doc.patientId._id ? doc.patientId : null;
    const patient = patientDoc ? {
        id: patientDoc._id.toString(),
        name: patientDoc.name || patientDoc.fullName,
        email: patientDoc.email,
        phone: patientDoc.phone,
        fullName: patientDoc.fullName,
        onboardingType: patientDoc.onboardingType,
        lmpDate: patientDoc.lmpDate,
    } : undefined;
    let patientPregnancyWeek;
    let patientTrimester;
    if (patientDoc?.lmpDate) {
        const lmpTime = new Date(patientDoc.lmpDate).getTime();
        const now = new Date().getTime();
        const diffDays = Math.max(0, Math.floor((now - lmpTime) / (1000 * 60 * 60 * 24)));
        patientPregnancyWeek = Math.floor(diffDays / 7);
        patientTrimester = patientPregnancyWeek < 13 ? 1 : patientPregnancyWeek < 28 ? 2 : 3;
    }
    const docApp = doc.doctorApplicationId && typeof doc.doctorApplicationId === 'object' ? doc.doctorApplicationId : null;
    const docUser = doc.doctorId && typeof doc.doctorId === 'object' ? doc.doctorId : null;
    const doctor = docApp ? {
        id: docApp._id ? docApp._id.toString() : '',
        userId: docUser?._id ? docUser._id.toString() : (doc.doctorId ? doc.doctorId.toString() : ''),
        name: docUser?.name || docApp.fullName,
        fullName: docApp.fullName,
        specialization: docApp.specialization,
        qualification: docApp.qualification || '',
        experience: docApp.experience || 0,
        registrationNumber: docApp.registrationNumber || '',
        consultationFee: docApp.consultationFee || 0,
        clinicName: docApp.clinicName,
        clinicAddress: docApp.clinicAddress || '',
        profileImage: docApp.profileImage,
        availability: docApp.availability,
        isVerified: true,
        phone: docUser?.phone,
    } : undefined;
    return {
        id: doc._id.toString(),
        patientId: doc.patientId?._id ? doc.patientId._id.toString() : (doc.patientId?.toString() || ''),
        doctorId: doc.doctorId?._id ? doc.doctorId._id.toString() : (doc.doctorId?.toString() || ''),
        status: doc.status,
        requestedAt: doc.requestedAt,
        respondedAt: doc.respondedAt,
        endedAt: doc.endedAt,
        rejectionReason: doc.rejectionReason,
        history: doc.history,
        patientName: patient?.name || patient?.fullName || 'Patient',
        patientEmail: patient?.email,
        patientPhone: patient?.phone,
        patientOnboardingType: patient?.onboardingType,
        patientPregnancyWeek,
        patientTrimester,
        doctorName: doctor?.fullName || doctor?.name,
        doctorSpecialization: doctor?.specialization,
        doctorClinicName: doctor?.clinicName,
        doctorProfileImage: doctor?.profileImage,
        patient,
        doctor,
    };
};
export const toDoctorReportDTO = (doc) => ({
    id: doc._id.toString(),
    patientId: doc.patientId?._id ? doc.patientId._id.toString() : (doc.patientId?.toString() || ''),
    doctorId: doc.doctorId?._id ? doc.doctorId._id.toString() : (doc.doctorId?.toString() || ''),
    appointmentId: doc.appointmentId?._id ? doc.appointmentId._id.toString() : (doc.appointmentId?.toString() || undefined),
    reason: doc.reason,
    description: doc.description,
    status: doc.status,
    adminRemarks: doc.adminRemarks,
    patientName: doc.patientId?.name || doc.patientId?.fullName,
    doctorName: doc.doctorId?.name,
    createdAt: doc.createdAt,
});
//# sourceMappingURL=doctor.mapper.js.map