import mongoose, { Document } from "mongoose";
export type DoctorReportReason = 'unprofessional_behavior' | 'missed_appointment' | 'incorrect_prescription' | 'billing_issue' | 'other';
export interface IDoctorReportDocument extends Document {
    patientId: mongoose.Types.ObjectId;
    doctorId: mongoose.Types.ObjectId;
    appointmentId?: mongoose.Types.ObjectId;
    reason: DoctorReportReason;
    description: string;
    status: 'submitted' | 'under_investigation' | 'resolved';
    adminRemarks?: string;
    resolvedAt?: Date;
    resolvedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IDoctorReportDocument, {}, {}, {}, mongoose.Document<unknown, {}, IDoctorReportDocument, {}, mongoose.DefaultSchemaOptions> & IDoctorReportDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IDoctorReportDocument>;
export default _default;
//# sourceMappingURL=doctorReport.model.d.ts.map