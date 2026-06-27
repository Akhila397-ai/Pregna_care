import { Types } from "mongoose";
import { doctorApplicationData, doctorProfileData,DoctorApplicationDocument } from "../../../types/doctor.js";


export interface IDoctorRepository {

    //Application
    createApplication(
        data: doctorApplicationData
    ): Promise<DoctorApplicationDocument>

    findApplicationByUserId(
        userId: string
    ): Promise<DoctorApplicationDocument | null>

    findApplicationById(
        id: string
    ): Promise<DoctorApplicationDocument | null>

    updateApplicationStatus(
        id: string,
        status: 'approved' | 'rejected',
        adminId?: string,
        rejectionReason?: string
    ): Promise<void>;

    createProfile(
        data: doctorProfileData
    ): Promise<doctorProfileData & {_id: Types.ObjectId}  >

    findProfileByUserId(
        userId: string
    ): Promise<(doctorProfileData & {_id: Types.ObjectId}) | null>

    findProfileById(
        id: string
    ): Promise<(doctorProfileData & {_id: Types.ObjectId}) | null>
}