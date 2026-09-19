import { injectable } from "inversify";
import { Types } from "mongoose";
import { IDoctorRepository } from "../interface/IDoctor.repository.js";
import { doctorApplicationData, DoctorApplicationDocument, DoctorApplicationWithUser } from "../../../types/doctor.js";
import doctorApplicationModel from "../../../models/doctorApplication.model.js";
import UserModel from "../../../models/User.model.js";
import { BaseRepository } from "../../base/base.repository.js";

@injectable()
export class DoctorRepository extends BaseRepository<doctorApplicationData> implements IDoctorRepository {
  constructor() {
    super(doctorApplicationModel);
  }

  async createApplication(data: doctorApplicationData): Promise<DoctorApplicationDocument> {
    const doc = await doctorApplicationModel.create(data);
    return doc.toObject() as DoctorApplicationDocument;
  }

  async findApplicationByUserId(userId: string): Promise<DoctorApplicationWithUser | null> {
    const userObjectId = Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId;
    const application = (await doctorApplicationModel
      .findOne({
        $or: [{ userId: userObjectId }, { _id: userObjectId }],
        isDeleted: false,
      })
      .lean()) as DoctorApplicationDocument | null;

    if (!application) return null;

    const user = await UserModel.findOne({ _id: application.userId, isDeleted: false }).lean();
    if (!user) return null;

    return {
      application,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        imageUrl: user.imageUrl,
        isBlocked: user.isBlocked,
        isVerified: user.isVerified,
        isDeleted: user.isDeleted,
      },
    };
  }

  async findApplicationById(id: string): Promise<DoctorApplicationDocument | null> {
    return (await doctorApplicationModel.findOne({ _id: id }).lean()) as DoctorApplicationDocument | null;
  }

  async updateApplicationStatus(
    id: string,
    status: "approved" | "rejected" | "pending",
    adminId?: string,
    rejectionReason?: string
  ): Promise<void> {
    const update: Partial<doctorApplicationData> = { status };

    if (status === "approved" && adminId) {
      update.approvedBy = new Types.ObjectId(adminId);
      update.approvedAt = new Date();
    }
    if (status === "rejected" && rejectionReason) {
      update.rejectionReason = rejectionReason;
    }
    await doctorApplicationModel.findByIdAndUpdate(id, { $set: update });
  }

  async updateApplication(id: string, data: Partial<doctorApplicationData>): Promise<void> {
    await doctorApplicationModel.findByIdAndUpdate(id, { $set: data });
  }
}