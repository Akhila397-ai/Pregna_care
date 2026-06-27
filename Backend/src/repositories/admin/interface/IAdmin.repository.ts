import { Types } from "mongoose";
import { IBaseRepository } from "../../base.repository.js";
import { userData } from "../../../types/user.js";
import { doctorApplicationData, DoctorApplicationDocument } from "../../../types/doctor.js";


export interface IAdminRepository extends IBaseRepository<userData> {

    findAdminByEmail(email: string): Promise<(userData & {_id: Types.ObjectId}) | null>;

    //userManagemnt
    findAllUsers(
        page: number,
        limit: number
    ): Promise<{
        users: (userData & {_id: Types.ObjectId; createdAt?: Date})[]
        total: number;
    }>
    findUserById(id: string): Promise<(userData & {_id: Types.ObjectId}) | null>
    blockUser(id: string): Promise<void>;
    unblockUser(id: string): Promise<void>;
    softDeleteUser(id: string): Promise<void>
    

    //doctorManagement
   findAllDoctors(page: number, limit: number): Promise<{
    doctors: DoctorApplicationDocument[];
    total: number
   }>;

   findDoctorById(id: string): Promise<DoctorApplicationDocument | null>
    approveDoctor(id: string,adminId: string): Promise<void>;
    rejectDoctor(id: string, rejectionReason: string): Promise<void>;
    blockDoctor(id: string): Promise<void>;
    unblockDoctor(id: string): Promise<void>;
    softDeleteDoctor(id: string): Promise<void>;


}