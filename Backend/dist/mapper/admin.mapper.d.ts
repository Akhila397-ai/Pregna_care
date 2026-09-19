import { Types } from "mongoose";
import { userData } from "../types/user.js";
import { IUserMappedData, IDoctorsMappedData, AdminAuthDTO } from "../dtos/admin.dto.js";
import { DoctorApplicationWithUser } from "../types/doctor.js";
export declare const toAdminAuthDTO: (user: userData & {
    _id: Types.ObjectId;
}) => AdminAuthDTO;
export declare const toUserMappedData: (user: userData & {
    _id: Types.ObjectId;
    createdAt?: Date;
}) => IUserMappedData;
export declare const toDoctorsMappedData: ({ application, user }: DoctorApplicationWithUser) => IDoctorsMappedData;
//# sourceMappingURL=admin.mapper.d.ts.map