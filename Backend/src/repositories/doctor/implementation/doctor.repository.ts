import { injectable } from "inversify";
import { Types } from "mongoose";
import { IDoctorRepository } from "../interface/iDoctor.repository.js";
import { doctorApplicationData,DoctorApplicationDocument, DoctorApplicationWithUser} from "../../../types/doctor.js";
import doctorApplicationModel from "../../../models/doctorApplication.model.js";
import DoctorProfileModel from '../../../models/doctor.model.js'
import { ApplicationStatusUpdate } from "../../../types/doctor.js";
import UserModel from "../../../models/User.model.js";

@injectable()
export class DoctorRepository implements IDoctorRepository {


  async createApplication(data: doctorApplicationData): Promise<DoctorApplicationDocument> {
      const doc = await doctorApplicationModel.create(data)
      return doc.toObject() as DoctorApplicationDocument;
  }
  
  async findApplicationByUserId(userId: string): Promise<DoctorApplicationDocument | null> {
     const doc = await doctorApplicationModel.findOne({ userId }).lean();

    return doc as DoctorApplicationDocument | null;
  }

  async findApplicationById(id: string): Promise<DoctorApplicationDocument | null> {
      const doc = await doctorApplicationModel
      .findOne({id})
      .lean()

      return doc as DoctorApplicationDocument | null
  }

  async updateApplicationStatus(id: string, status: "approved" | "rejected" | 'pending', adminId?: string, rejectionReason?: string): Promise<void> {

      const update : Partial<doctorApplicationData> = { status};

      if(status === 'approved' && adminId){
        update.approvedBy = new Types.ObjectId(adminId)
        update.approvedAt = new Date()
      }
       if (status === 'rejected' && rejectionReason) {
      update.rejectionReason = rejectionReason;
    }
    await doctorApplicationModel.findByIdAndUpdate(
      id,
      {$set: update}
    )

  }

  async updateApplication(id: string, data: Partial<doctorApplicationData>): Promise<void> {
      await doctorApplicationModel.findByIdAndUpdate(
        id,
        {$set: data}
      )
  }

  

   //dcotorprofilr

  //  async createProfile(data: DoctorApplicationDocument): Promise<DoctorApplicationDocument & { _id: Types.ObjectId; } > {
  //      return await DoctorProfileModel.create(data)
  //  }

  //  async findProfileByUserId(userId: string): Promise<(DoctorApplicationDocument & { _id: Types.ObjectId; }) | null> {
  //      return await DoctorProfileModel.findOne({userId: new Types.ObjectId(userId)})
  //      .lean()
  //  }

  //  async findProfileById(id: string): Promise<(DoctorApplicationDocument & { _id: Types.ObjectId; }) | null> {
  //      return await DoctorProfileModel.findById(id).lean()
  //  }
}