import { injectable } from "inversify";
import { Types } from "mongoose";
import { IDoctorRepository } from "../interface/iDoctor.repository.js";
import { doctorApplicationData,doctorProfileData,DoctorApplicationDocument} from "../../../types/doctor.js";
import doctorApplicationModel from "../../../models/doctorApplication.model.js";
import DoctorProfileModel from '../../../models/doctor.model.js'
import { ApplicationStatusUpdate } from "../../../types/doctor.js";

@injectable()
export class DoctorRepository implements IDoctorRepository {


  async createApplication(data: doctorApplicationData): Promise<DoctorApplicationDocument> {
      return await doctorApplicationModel.create(data) as DoctorApplicationDocument;
  }
  
  async findApplicationByUserId(userId: string): Promise<DoctorApplicationDocument | null> {
      return await doctorApplicationModel
      .findOne({ userId: new Types.ObjectId})
      .lean() as DoctorApplicationDocument | null;
  }

  async findApplicationById(id: string): Promise<DoctorApplicationDocument | null> {
      return await doctorApplicationModel
      .findById(id)
      .lean() as DoctorApplicationDocument | null;
  }

  async updateApplicationStatus(id: string, status: "approved" | "rejected", adminId?: string, rejectionReason?: string): Promise<void> {
      const update: ApplicationStatusUpdate = {status};

      if(status === 'approved' && adminId){
        update.approvedBy = new Types.ObjectId(adminId);
        update.approvedAt = new Date();
      }
      if(status === 'rejected'){
        update.rejectionReason = rejectionReason;
      }

      await doctorApplicationModel.findByIdAndUpdate(
        id,
        {$set: update}
      )
  }

   //dcotorprofilr

   async createProfile(data: doctorProfileData): Promise<doctorProfileData & { _id: Types.ObjectId; } > {
       return await DoctorProfileModel.create(data)
   }

   async findProfileByUserId(userId: string): Promise<(doctorProfileData & { _id: Types.ObjectId; }) | null> {
       return await DoctorProfileModel.findOne({userId: new Types.ObjectId(userId)})
       .lean()
   }

   async findProfileById(id: string): Promise<(doctorProfileData & { _id: Types.ObjectId; }) | null> {
       return await DoctorProfileModel.findById(id).lean()
   }
}