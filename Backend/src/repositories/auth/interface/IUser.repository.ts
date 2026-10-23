import { IBaseRepository } from "../../base/IBase.repository.js";
import { EmergencyContactRelationship, onboardingType, userData } from "../../../types/user.js";
import { Types } from "mongoose";

export interface IUserRepository extends IBaseRepository<userData> {
  findByEmail(email: string): Promise<(userData & { _id: Types.ObjectId }) | null>;
  updatePassword(id: string, hash: string): Promise<void>;
  markVerified(id: string): Promise<void>;
  updateRole(id: string, role: string): Promise<void>;
  setOnboarding(id: string, onboardingType: onboardingType): Promise<void>;
  setPregnancyLMP(id: string, lmpDate: Date): Promise<void>;
  setCycleInfo(id: string, periodStartDate: Date, cycleLength?: number, periodLength?: number): Promise<void>;
  addEmergencyContact(
    userId: string,
    contact: { name: string; phoneNumber: string; relationship: EmergencyContactRelationship }
  ): Promise<(userData & { _id: Types.ObjectId }) | null>;
  updateEmergencyContact(
    userId: string,
    contactId: string,
    contact: { name: string; phoneNumber: string; relationship: EmergencyContactRelationship }
  ): Promise<(userData & { _id: Types.ObjectId }) | null>;
  deleteEmergencyContact(
    userId: string,
    contactId: string
  ): Promise<(userData & { _id: Types.ObjectId }) | null>;
  setRefreshTokenHash(
    id: string,
    tokenHash: string
  ): Promise<boolean>
  rotateRefreshTokenHash(
    id: string,
    currentHash: string,
    nextHash: string
  ): Promise<boolean>

  revokeRefreshTokenHash(
    tokenHash: string
  ): Promise<boolean>;
  getRefreshToken(
    id: string
  ): Promise<string | null>
}