import { User } from "../../models/User.model.js";
import { IUser } from "../../interfaces/IUser.js";
import { IUserRepository } from "../interfaces/user.repository.interface.js";
import { Document } from "mongoose";


export class UserRepository implements IUserRepository {
    async findEmail(email: string): Promise<(IUser & Document) | null> {
        return User.findOne({email})
    }

    async create(data: Partial<IUser>): Promise<IUser & Document> {
        return User.create(data)
    }
    async updateByEmail(email: string, data: Partial<IUser>): Promise<(IUser & Document) | null> {
        return User.findOneAndUpdate({email},data,{returnDocument: "after"})
    }
    async findById(id: string): Promise<(IUser & Document) | null> {
        return User.findById(id)
    }
}