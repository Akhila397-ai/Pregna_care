import mongoose, { Document } from "mongoose";
export interface IAppointmentDocument extends Document {
    patientId: mongoose.Types.ObjectId;
    doctorId: mongoose.Types.ObjectId;
    doctorApplicationId: mongoose.Types.ObjectId;
    appointmentDate: Date;
    timeSlot: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    reason?: string;
    consultationNotes?: string;
    prescription?: string;
    completedAt?: Date;
    cancelledAt?: Date;
    cancelReason?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IAppointmentDocument, {}, {}, {}, mongoose.Document<unknown, {}, IAppointmentDocument, {}, mongoose.DefaultSchemaOptions> & IAppointmentDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IAppointmentDocument>;
export default _default;
//# sourceMappingURL=appointment.model.d.ts.map