import mongoose, { Document } from "mongoose";
import { doctorApplicationData } from "../types/doctor.js";
export interface IDoctorApplicationDocument extends doctorApplicationData, Document {
}
declare const _default: mongoose.Model<IDoctorApplicationDocument, {}, {}, {}, mongoose.Document<unknown, {}, IDoctorApplicationDocument, {}, mongoose.DefaultSchemaOptions> & IDoctorApplicationDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IDoctorApplicationDocument>;
export default _default;
//# sourceMappingURL=doctorApplication.model.d.ts.map