export const toUserAuthDTO = (user) => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    isBlocked: !!user.isBlocked,
    isVerified: !!user.isVerified,
    isOnboarded: user.isOnboarded,
    onboardingType: user.onboardingType,
});
export const toUserprofileDTO = (user) => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    isBlocked: user.isBlocked,
    isVerified: user.isVerified,
    isOnboarded: user.isOnboarded,
    onboardingType: user.onboardingType,
    phone: user.phone,
    imageUrl: user.imageUrl,
    createdAt: user.createdAt,
});
//# sourceMappingURL=user.mapper.js.map