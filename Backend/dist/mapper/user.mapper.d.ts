import { EmergencyContactDTO, UserAuthDTO, UserProfileDTO } from "../dtos/user.dto.js";
import { Types } from "mongoose";
import { IEmergencyContact, userData } from "../types/user.js";
export declare const toEmergencyContactDTO: (contact: IEmergencyContact & {
    _id?: any;
}) => EmergencyContactDTO;
export declare const toUserAuthDTO: (user: userData & {
    _id: Types.ObjectId;
}) => UserAuthDTO;
export declare const toUserprofileDTO: (user: userData & {
    _id: Types.ObjectId;
}) => UserProfileDTO;
//# sourceMappingURL=user.mapper.d.ts.map