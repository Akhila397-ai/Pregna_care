import { injectable } from "inversify";
import { Types } from "mongoose";
import PrimaryDoctorRelationshipModel, {
  IPrimaryDoctorRelationshipDocument,
  RelationshipEvent,
} from "../../../models/primaryDoctorRelationship.model.js";
import UserModel from "../../../models/User.model.js";
import { IPrimaryDoctorRepository } from "../interface/IPrimaryDoctor.repository.js";

@injectable()
export class PrimaryDoctorRepository implements IPrimaryDoctorRepository {
  async createRequest(
    patientId: string,
    doctorId: string,
    doctorApplicationId: string
  ): Promise<IPrimaryDoctorRelationshipDocument> {
    const pId = new Types.ObjectId(patientId);
    const dId = new Types.ObjectId(doctorId);
    const docAppId = new Types.ObjectId(doctorApplicationId);

    const doc = await PrimaryDoctorRelationshipModel.create({
      patientId: pId,
      doctorId: dId,
      doctorApplicationId: docAppId,
      status: 'pending',
      requestedAt: new Date(),
      history: [
        {
          event: 'PRIMARY_REQUESTED',
          timestamp: new Date(),
          note: 'Primary doctor relationship requested by patient.',
        },
      ],
    });
    return doc;
  }

  async findActiveRelationship(patientId: string): Promise<IPrimaryDoctorRelationshipDocument | null> {
    const pId = Types.ObjectId.isValid(patientId) ? new Types.ObjectId(patientId) : patientId;
    return await PrimaryDoctorRelationshipModel.findOne({
      patientId: pId,
      status: 'active',
    })
      .populate('doctorId', 'name email phone imageUrl')
      .populate('doctorApplicationId', 'fullName specialization qualification experience clinicName clinicAddress profileImage consultationFee availability');
  }

  async findPendingRelationship(patientId: string): Promise<IPrimaryDoctorRelationshipDocument | null> {
    const pId = Types.ObjectId.isValid(patientId) ? new Types.ObjectId(patientId) : patientId;
    return await PrimaryDoctorRelationshipModel.findOne({
      patientId: pId,
      status: 'pending',
    })
      .populate('doctorId', 'name email phone imageUrl')
      .populate('doctorApplicationId', 'fullName specialization qualification experience clinicName clinicAddress profileImage consultationFee availability');
  }

  async findRelationshipById(relationshipId: string): Promise<IPrimaryDoctorRelationshipDocument | null> {
    const rId = Types.ObjectId.isValid(relationshipId) ? new Types.ObjectId(relationshipId) : relationshipId;
    return await PrimaryDoctorRelationshipModel.findById(rId)
      .populate('patientId', 'name email phone fullName lmpDate onboardingType')
      .populate('doctorId', 'name email phone imageUrl')
      .populate('doctorApplicationId', 'fullName specialization qualification experience clinicName clinicAddress profileImage consultationFee availability');
  }

  async findRequestsForDoctor(
    doctorId: string,
    status = 'pending'
  ): Promise<IPrimaryDoctorRelationshipDocument[]> {
    const dId = Types.ObjectId.isValid(doctorId) ? new Types.ObjectId(doctorId) : doctorId;
    const filter: any = { doctorId: dId };
    if (status) {
      filter.status = status;
    }
    return await PrimaryDoctorRelationshipModel.find(filter)
      .populate('patientId', 'name email phone fullName lmpDate onboardingType')
      .sort({ requestedAt: -1, createdAt: -1 });
  }

  async findPatientRelationshipHistory(
    patientId: string
  ): Promise<IPrimaryDoctorRelationshipDocument[]> {
    const pId = Types.ObjectId.isValid(patientId) ? new Types.ObjectId(patientId) : patientId;
    return await PrimaryDoctorRelationshipModel.find({ patientId: pId })
      .populate('doctorId', 'name email phone imageUrl')
      .populate('doctorApplicationId', 'fullName specialization clinicName')
      .sort({ createdAt: -1 });
  }

  async updateStatus(
    relationshipId: string,
    status: 'pending' | 'active' | 'declined' | 'cancelled' | 'ended',
    event: RelationshipEvent,
    note?: string,
    rejectionReason?: string
  ): Promise<IPrimaryDoctorRelationshipDocument | null> {
    const rId = Types.ObjectId.isValid(relationshipId) ? new Types.ObjectId(relationshipId) : relationshipId;
    const updatePayload: any = {
      status,
      $push: {
        history: {
          event,
          timestamp: new Date(),
          note: note || `Status updated to ${status}`,
        },
      },
    };

    if (status === 'active' || status === 'declined') {
      updatePayload.respondedAt = new Date();
    }
    if (status === 'ended' || status === 'cancelled') {
      updatePayload.endedAt = new Date();
    }
    if (rejectionReason) {
      updatePayload.rejectionReason = rejectionReason;
    }

    const updated = await PrimaryDoctorRelationshipModel.findByIdAndUpdate(
      rId,
      updatePayload,
      { new: true }
    )
      .populate('patientId', 'name email phone fullName lmpDate onboardingType')
      .populate('doctorId', 'name email phone imageUrl')
      .populate('doctorApplicationId', 'fullName specialization qualification experience clinicName clinicAddress profileImage consultationFee availability');

    // Update patient user's primaryDoctorId accordingly
    if (updated) {
      if (status === 'active') {
        await UserModel.findByIdAndUpdate(updated.patientId, {
          $set: { primaryDoctorId: updated.doctorId },
        });
      } else if (status === 'ended' || status === 'cancelled') {
        await UserModel.findByIdAndUpdate(updated.patientId, {
          $set: { primaryDoctorId: null },
        });
      }
    }

    return updated;
  }

  async endActiveRelationshipsForPatient(patientId: string, newDoctorName?: string): Promise<void> {
    const pId = Types.ObjectId.isValid(patientId) ? new Types.ObjectId(patientId) : patientId;
    const now = new Date();
    await PrimaryDoctorRelationshipModel.updateMany(
      {
        patientId: pId,
        status: 'active',
      },
      {
        $set: {
          status: 'ended',
          endedAt: now,
        },
        $push: {
          history: {
            event: 'PRIMARY_CHANGED',
            timestamp: now,
            note: newDoctorName
              ? `Primary doctor changed to ${newDoctorName}.`
              : 'Primary doctor relationship ended.',
          },
        },
      }
    );
  }
}
