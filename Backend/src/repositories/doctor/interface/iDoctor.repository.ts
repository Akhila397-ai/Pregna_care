import { Types } from "mongoose";
import { doctorApplicationData, doctorProfileData } from "../../../types/doctor.js";


export interface IDoctorRepository {

    //Application
    createApplication(
        data: doctorApplicationData
    ): Promise<doctorApplicationData & { _id: Types.ObjectId}>

    findApplicationByUserId(
        userId: string
    ): Promise<(doctorApplicationData & { _id: Types.ObjectId}) | null>

    findApplicationById(
        id: string
    ): Promise<(doctorApplicationData & { _id: Types.ObjectId}) | null>

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