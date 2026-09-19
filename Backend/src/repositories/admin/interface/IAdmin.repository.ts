import { Types } from "mongoose";
import { IBaseRepository } from "../../base/IBase.repository.js";
import { userData } from "../../../types/user.js";
import { DoctorApplicationWithUser, DoctorStatus } from "../../../types/doctor.js";

export interface IAdminRepository extends IBaseRepository<userData> {
  findAdminByEmail(email: string): Promise<(userData & { _id: Types.ObjectId }) | null>;

  // User Management
  findAllUsers(
    page: number,
    limit: number
  ): Promise<{
    users: (userData & { _id: Types.ObjectId; createdAt?: Date })[];
    total: number;
  }>;
  findUserById(id: string): Promise<(userData & { _id: Types.ObjectId }) | null>;
  blockUser(id: string): Promise<void>;
  unblockUser(id: string): Promise<void>;
  softDeleteUser(id: string): Promise<void>;

  // Doctor Management
  findAllDoctors(
    page: number,
    limit: number
  ): Promise<{
    doctors: DoctorApplicationWithUser[];
    total: number;
  }>;
  findDoctorById(id: string): Promise<DoctorApplicationWithUser | null>;
  approveDoctor(id: string, adminId: string): Promise<void>;
  verifyDoctor(id: string, status: DoctorStatus, adminId: string, remarks?: string): Promise<void>;
  rejectDoctor(id: string, rejectionReason: string): Promise<void>;
  blockDoctor(id: string): Promise<void>;
  unblockDoctor(id: string): Promise<void>;
  softDeleteDoctor(id: string): Promise<void>;
}