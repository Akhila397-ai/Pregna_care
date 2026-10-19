import mongoose, { Document } from "mongoose";
import { userData } from "../types/user.js";
export interface IUserDocument extends userData, Document {
}
declare const _default: mongoose.Model<any, {}, {}, {}, any, any, any>;
export default _default;
//# sourceMappingURL=User.model.d.ts.map