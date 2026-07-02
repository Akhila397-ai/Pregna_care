import { UserAuthDTO, UserProfileDTO } from "../dtos/user.dto.js";
import { Types } from "mongoose";
import { userData } from "../types/user.js";

export const toUserAuthDTO = ( user: userData & { _id: Types.ObjectId}): UserAuthDTO => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    isBlocked: !!user.isBlocked,
    isVerified: !!user.isVerified,
    isOnboarded: user.isOnboarded,
    onboardingType: user.onboardingType,
});

export const toUserprofileDTO = (
    user: userData & {_id: Types.ObjectId}
): UserProfileDTO => ({
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

})