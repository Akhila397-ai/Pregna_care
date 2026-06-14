import { Types } from "mongoose";
import { IBaseRepository } from "../../base.repository.js";
import { userData } from "../../../types/user.js";


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
    findAllDoctors(
        page: number,
        limit: number
    ): Promise<{
        doctors: (userData & {
            _id: Types.ObjectId;
            isApproved?: boolean;
            specialization?: string;
            createdAt?: Date;
        })[];
        total: number;
    }>

    findDoctorById(id: string):Promise<(userData & {_id: Types.ObjectId}) | null>;
    approveDoctor(id: string): Promise<void>;
    rejectDoctor(id: string): Promise<void>;
    blockDoctor(id: string): Promise<void>;
    unblockDoctor(id: string): Promise<void>;


}