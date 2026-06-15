import { AdminAuthResponseDTO,GetMappedDoctorsResponse,GetMappedUsersResponse } from "../../../dtos/admin.dto.js";
import { MessageResponseDTO } from "../../../dtos/auth.dto.js";


export interface IAdminService {
    login(email: string,password: string): Promise<AdminAuthResponseDTO>;

    //userManagment
    getAllUsers(page: number, limit: number): Promise<GetMappedUsersResponse>;
    blockUser(userId: string): Promise<MessageResponseDTO>;
    unblockUser(userId: string): Promise<MessageResponseDTO>;
    deleteUser(userid: string): Promise<MessageResponseDTO>;


    //doctorManagement
    getAllDoctors(page: Number, limit: number): Promise<GetMappedDoctorsResponse>;
    approveDoctor(doctorId: string): Promise<MessageResponseDTO>;
    rejectDoctor(doctorId: string): Promise<MessageResponseDTO>
    blockDoctor(doctorId: string): Promise<MessageResponseDTO>;
    unblockDoctor(doctorId: string): Promise<MessageResponseDTO>
    deleteDoctor(doctorId: string): Promise<MessageResponseDTO>;
}