import { IPrimaryDoctorRelationshipDocument, RelationshipEvent } from "../../../models/primaryDoctorRelationship.model.js";
export interface IPrimaryDoctorRepository {
    createRequest(patientId: string, doctorId: string, doctorApplicationId: string): Promise<IPrimaryDoctorRelationshipDocument>;
    findActiveRelationship(patientId: string): Promise<IPrimaryDoctorRelationshipDocument | null>;
    findPendingRelationship(patientId: string): Promise<IPrimaryDoctorRelationshipDocument | null>;
    findRelationshipById(relationshipId: string): Promise<IPrimaryDoctorRelationshipDocument | null>;
    findRequestsForDoctor(doctorId: string, status?: string): Promise<IPrimaryDoctorRelationshipDocument[]>;
    findPatientRelationshipHistory(patientId: string): Promise<IPrimaryDoctorRelationshipDocument[]>;
    updateStatus(relationshipId: string, status: 'pending' | 'active' | 'declined' | 'cancelled' | 'ended', event: RelationshipEvent, note?: string, rejectionReason?: string): Promise<IPrimaryDoctorRelationshipDocument | null>;
    endActiveRelationshipsForPatient(patientId: string, newDoctorName?: string): Promise<void>;
}
//# sourceMappingURL=IPrimaryDoctor.repository.d.ts.map