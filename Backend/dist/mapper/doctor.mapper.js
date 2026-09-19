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
//# sourceMappingURL=doctor.mapper.js.map