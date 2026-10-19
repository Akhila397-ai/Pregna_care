import mongoose, { Document } from "mongoose";
export type RelationshipEvent = 'PRIMARY_REQUESTED' | 'PRIMARY_ACCEPTED' | 'PRIMARY_DECLINED' | 'PRIMARY_CANCELLED' | 'PRIMARY_CHANGED' | 'PRIMARY_ENDED';
export interface IRelationshipHistoryItem {
    event: RelationshipEvent;
    timestamp: Date;
    note?: string;
}
export interface IPrimaryDoctorRelationshipDocument extends Document {
    patientId: mongoose.Types.ObjectId;
    doctorId: mongoose.Types.ObjectId;
    doctorApplicationId: mongoose.Types.ObjectId;
    status: 'pending' | 'active' | 'declined' | 'cancelled' | 'ended';
    requestedAt: Date;
    respondedAt?: Date;
    endedAt?: Date;
    rejectionReason?: string;
    history: IRelationshipHistoryItem[];
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IPrimaryDoctorRelationshipDocument, {}, {}, {}, mongoose.Document<unknown, {}, IPrimaryDoctorRelationshipDocument, {}, mongoose.DefaultSchemaOptions> & IPrimaryDoctorRelationshipDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IPrimaryDoctorRelationshipDocument>;
export default _default;
//# sourceMappingURL=primaryDoctorRelationship.model.d.ts.map