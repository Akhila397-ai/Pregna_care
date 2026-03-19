import { IUser } from "../../interfaces/IUser.js";
import { Document } from "mongoose";


export interface IUserRepository {
    findEmail(email: string): Promise<(IUser &Document) | null>;

    create(data: Partial<IUser>): Promise<IUser & Document>;

    updateByEmail(
        email: string,
        data: Partial<IUser>
    ):Promise<(IUser & Document) | null>

    findById(id: string): Promise<(IUser & Document) | null>
}