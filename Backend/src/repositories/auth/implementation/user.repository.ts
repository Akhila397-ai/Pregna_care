import { injectable } from "inversify";
import { Types } from "mongoose";
import { IUserRepository } from "../interface/IUser.repository.js";
import { EmergencyContactRelationship, onboardingType, userData } from "../../../types/user.js";
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

  async setRefreshTokenHash(id: string, tokenHash: string): Promise<boolean> {
      const objectId = Types.ObjectId.isValid(id)
      ? new Types.ObjectId(id)
      : id;
      const result = await this.model.updateOne(
        {_id: objectId},
        {$set: { refreshTokenHash: tokenHash}}
      );
      return result.matchedCount > 0
  }

  async rotateRefreshTokenHash(id: string, currentHash: string, nextHash: string): Promise<boolean> {
      const objectId = Types.ObjectId.isValid(id)
      ? new Types.ObjectId(id)
      : id;

      const result = await this.model.updateOne(
        {_id: objectId, refreshTokenHash: currentHash},
        {$set: {refreshTokenHash: nextHash}}
      )
      return result.modifiedCount > 0
  }
  async revokeRefreshTokenHash(tokenHash: string): Promise<boolean> {
      const result = await this.model.updateOne(
        {refreshTokenHash: tokenHash},
        {$unset: {refreshTokenHash: ""}}
      )
      return result.modifiedCount > 0
  }
 async getRefreshToken(id: string): Promise<string | null> {
      const objectId = Types.ObjectId.isValid(id)
      ? new Types.ObjectId(id)
      : id;

      const user = await this.model
      .findById(objectId)
      .select('+refreshTokenHash')
      .lean()
      return user?.refreshTokenHash ?? null;
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

  async setPregnancyLMP(id: string, lmpDate: Date): Promise<void> {
    const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
    await this.model.findByIdAndUpdate(objectId, {
      $set: {
        lmpDate,
        onboardingType: 'pregnant',
        isOnboarded: true,
      },
    });
  }

  async setCycleInfo(
    id: string,
    periodStartDate: Date,
    cycleLength = 28,
    periodLength = 5
  ): Promise<void> {
    const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
    await this.model.findByIdAndUpdate(objectId, {
      $set: {
        periodStartDate,
        cycleLength,
        periodLength,
        onboardingType: 'trying',
        isOnboarded: true,
      },
    });
  }

  async addEmergencyContact(
    userId: string,
    contact: { name: string; phoneNumber: string; relationship: EmergencyContactRelationship }
  ): Promise<(userData & { _id: Types.ObjectId }) | null> {
    const objectId = Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId;
    return await this.model.findByIdAndUpdate(
      objectId,
      {
        $push: {
          emergencyContacts: {
            name: contact.name,
            phoneNumber: contact.phoneNumber,
            relationship: contact.relationship,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );
  }

  async updateEmergencyContact(
    userId: string,
    contactId: string,
    contact: { name: string; phoneNumber: string; relationship: EmergencyContactRelationship }
  ): Promise<(userData & { _id: Types.ObjectId }) | null> {
    const userObjectId = Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId;
    const contactObjectId = Types.ObjectId.isValid(contactId) ? new Types.ObjectId(contactId) : contactId;

    return await this.model.findOneAndUpdate(
      { _id: userObjectId, "emergencyContacts._id": contactObjectId },
      {
        $set: {
          "emergencyContacts.$.name": contact.name,
          "emergencyContacts.$.phoneNumber": contact.phoneNumber,
          "emergencyContacts.$.relationship": contact.relationship,
        },
      },
      { new: true }
    );
  }

  async deleteEmergencyContact(
    userId: string,
    contactId: string
  ): Promise<(userData & { _id: Types.ObjectId }) | null> {
    const userObjectId = Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId;
    const contactObjectId = Types.ObjectId.isValid(contactId) ? new Types.ObjectId(contactId) : contactId;

    return await this.model.findByIdAndUpdate(
      userObjectId,
      {
        $pull: {
          emergencyContacts: { _id: contactObjectId },
        },
      },
      { new: true }
    );
  }
}
