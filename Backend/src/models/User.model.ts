import mongoose, {Schema, Document} from "mongoose";
import { userData } from "../types/user.js";



export interface IUserDocument extends userData, Document {};

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    phone:{
      type: String
    },
    password: {
      type: String,
      required: true
    },
     role:       {
      type:    String,
      enum:    ['user', 'admin', 'doctor'],
      default: 'user',
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    imageUrl: {
      type: String
    }
    

  },
  { timestamps: true}
)

export default mongoose.model<IUserDocument>('User',UserSchema)