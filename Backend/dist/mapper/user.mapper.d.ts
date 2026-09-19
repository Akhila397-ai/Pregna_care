import { UserAuthDTO, UserProfileDTO } from "../dtos/user.dto.js";
import { Types } from "mongoose";
import { userData } from "../types/user.js";
export declare const toUserAuthDTO: (user: userData & {
    _id: Types.ObjectId;
}) => UserAuthDTO;
export declare const toUserprofileDTO: (user: userData & {
    _id: Types.ObjectId;
}) => UserProfileDTO;
//# sourceMappingURL=user.mapper.d.ts.map