import { UserAuthDTO } from "../dtos/user.dto.js";
import { Types } from "mongoose";
import { userData } from "../types/user.js";

export const toUserAuthDTO = ( user: userData & { _id: Types.ObjectId}): UserAuthDTO => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    isBlocked: !!user.isBlocked,
    isVerified: !!user.isVerified
});