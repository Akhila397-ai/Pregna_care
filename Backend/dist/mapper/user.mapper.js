export const toEmergencyContactDTO = (contact) => ({
    id: contact._id ? contact._id.toString() : '',
    name: contact.name,
    phoneNumber: contact.phoneNumber,
    relationship: contact.relationship,
    createdAt: contact.createdAt,
});
export const toUserAuthDTO = (user) => {
    const isOnboarded = Boolean(user.isOnboarded ||
        user.lmpDate ||
        user.periodStartDate ||
        user.onboardingType === 'exploring');
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: !!user.isBlocked,
        isVerified: !!user.isVerified,
        isOnboarded,
        onboardingType: user.onboardingType,
        lmpDate: user.lmpDate,
        periodStartDate: user.periodStartDate,
        cycleLength: user.cycleLength,
        emergencyContacts: (user.emergencyContacts || []).map(toEmergencyContactDTO),
    };
};
export const toUserprofileDTO = (user) => {
    const isOnboarded = Boolean(user.isOnboarded ||
        user.lmpDate ||
        user.periodStartDate ||
        user.onboardingType === 'exploring');
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
        isVerified: user.isVerified,
        isOnboarded,
        onboardingType: user.onboardingType,
        lmpDate: user.lmpDate,
        periodStartDate: user.periodStartDate,
        cycleLength: user.cycleLength,
        phone: user.phone,
        imageUrl: user.imageUrl,
        createdAt: user.createdAt,
        emergencyContacts: (user.emergencyContacts || []).map(toEmergencyContactDTO),
    };
};
//# sourceMappingURL=user.mapper.js.map