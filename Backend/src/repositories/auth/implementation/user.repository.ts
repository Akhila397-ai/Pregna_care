import { injectable } from "inversify";
import { Types } from "mongoose";
import { IUserRepository } from "../interface/IUser.repository.js";
import { onboardingType, userData } from "../../../types/user.js";
import userModel from "../../../models/User.model.js";
import { BaseRepository } from "../../base/base.repository.js";

@injectable()
export class UserRepository extends BaseRepository<userData> implements IUserRepository {
  constructor() {
    super(userModel);
  }

  async findByEmail(email: string): Promise<(userData & { _id: Types.ObjectId }) | null> {
    return await this.findOne({ email });
  }

  async updatePassword(id: string, hash: string): Promise<void> {
    const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
    await this.model.findByIdAndUpdate(objectId, { $set: { password: hash } });
  }

  async markVerified(id: string): Promise<void> {
    const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
    await this.model.findByIdAndUpdate(objectId, { $set: { isVerified: true } });
  }

  async updateRole(id: string, role: string): Promise<void> {
    const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
    await this.model.findByIdAndUpdate(objectId, { $set: { role } });
  }

  async setOnboarding(id: string, onboardingType: onboardingType): Promise<void> {
    const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
    await this.model.findByIdAndUpdate(objectId, {
      $set: {
        onboardingType,
        isOnboarded: true,
      },
    });
  }
}
