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

  async findVerifiedDoctors(): Promise<DoctorApplicationWithUser[]> {
    const applications = (await doctorApplicationModel
      .find({
        status: "approved",
        isBlocked: false,
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .lean()) as DoctorApplicationDocument[];

    if (!applications.length) return [];

    const userIds = applications.map((app) => app.userId);
    const users = await UserModel.find({
      _id: { $in: userIds },
      role: "doctor",
      isVerified: true,
      isBlocked: false,
      isDeleted: false,
    }).lean();

    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    return applications
      .map((app): DoctorApplicationWithUser | null => {
        const user = userMap.get(app.userId.toString());
        if (!user) return null;

        return {
          application: app,
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
      })
      .filter((item): item is DoctorApplicationWithUser => item !== null);
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
    const app = await doctorApplicationModel.findByIdAndUpdate(id, { $set: update }, { new: true });
    if (status === "approved" && app) {
      await UserModel.findByIdAndUpdate(app.userId, { $set: { role: "doctor", isVerified: true } });
    } else if (status === "rejected" && app) {
      await UserModel.findByIdAndUpdate(app.userId, { $set: { role: "user" } });
    }
  }

  async updateApplication(id: string, data: Partial<doctorApplicationData>): Promise<void> {
    await doctorApplicationModel.findByIdAndUpdate(id, { $set: data });
  }
}