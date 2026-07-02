import { Types } from "mongoose";
import { doctorApplicationData,DoctorApplicationWithUser,DoctorApplicationDocument } from "../../../types/doctor.js";


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
        status: 'approved' | 'rejected'|'pending',
        adminId?: string,
        rejectionReason?: string
    ): Promise<void>;
    updateApplication(id: string,data: Partial<doctorApplicationData>): Promise<void>;

//     createProfile(
//         data: DoctorApplicationDocument
//     ): Promise<DoctorApplicationDocument & {_id: Types.ObjectId}  >

//     findProfileByUserId(
//         userId: string
//     ): Promise<(DoctorApplicationDocument & {_id: Types.ObjectId}) | null>

//     findProfileById(
//         id: string
//     ): Promise<(DoctorApplicationDocument & {_id: Types.ObjectId}) | null>
}