import { User } from "../models/User.model.js";
import { IUser } from "../interfaces/IUser.js";
import { BaseRepository } from "./base.repository.js";
import { HydratedDocument,Model } from "mongoose";

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  findByEmail(email: string):Promise<HydratedDocument<IUser> | null> {
    return this.model.findOne({ email });
  }
}