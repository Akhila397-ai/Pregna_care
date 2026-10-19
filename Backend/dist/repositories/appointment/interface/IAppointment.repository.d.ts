import { Types } from "mongoose";
import { IAppointmentDocument } from "../../../models/appointment.model.js";
export interface CreateAppointmentData {
    patientId: Types.ObjectId | string;
    doctorId: Types.ObjectId | string;
    doctorApplicationId: Types.ObjectId | string;
    appointmentDate: Date;
    timeSlot: string;
    reason?: string;
}
export interface IAppointmentRepository {
    createAppointment(data: CreateAppointmentData): Promise<IAppointmentDocument>;
    findPatientAppointments(patientId: string): Promise<IAppointmentDocument[]>;
    findDoctorAppointments(doctorId: string): Promise<IAppointmentDocument[]>;
    findAppointmentById(appointmentId: string): Promise<IAppointmentDocument | null>;
    isSlotBooked(doctorId: string, appointmentDate: Date, timeSlot: string): Promise<boolean>;
    completeAppointment(appointmentId: string, consultationNotes?: string, prescription?: string): Promise<IAppointmentDocument | null>;
    cancelAppointment(appointmentId: string, cancelReason?: string): Promise<IAppointmentDocument | null>;
}
//# sourceMappingURL=IAppointment.repository.d.ts.map