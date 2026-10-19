import mongoose, { Document } from "mongoose";
import { otpData } from "../types/otp.js";
export interface IOTPDocument extends otpData, Document {
}
declare const _default: mongoose.Model<IOTPDocument, {}, {}, {}, mongoose.Document<unknown, {}, IOTPDocument, {}, mongoose.DefaultSchemaOptions> & IOTPDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IOTPDocument>;
export default _default;
//# sourceMappingURL=otp.model.d.ts.map