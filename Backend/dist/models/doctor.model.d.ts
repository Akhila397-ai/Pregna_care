import mongoose, { Document } from "mongoose";
import { doctorProfileData } from "../types/doctor.js";
export interface IDoctorProfileDocument extends doctorProfileData, Document {
}
declare const _default: mongoose.Model<IDoctorProfileDocument, {}, {}, {}, mongoose.Document<unknown, {}, IDoctorProfileDocument, {}, mongoose.DefaultSchemaOptions> & IDoctorProfileDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IDoctorProfileDocument>;
export default _default;
//# sourceMappingURL=doctor.model.d.ts.map