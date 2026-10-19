import { IAppointmentDocument } from "../../../models/appointment.model.js";
import { CreateAppointmentData, IAppointmentRepository } from "../interface/IAppointment.repository.js";
export declare class AppointmentRepository implements IAppointmentRepository {
    createAppointment(data: CreateAppointmentData): Promise<IAppointmentDocument>;
    findPatientAppointments(patientId: string): Promise<IAppointmentDocument[]>;
    findDoctorAppointments(doctorId: string): Promise<IAppointmentDocument[]>;
    findAppointmentById(appointmentId: string): Promise<IAppointmentDocument | null>;
    isSlotBooked(doctorId: string, appointmentDate: Date, timeSlot: string): Promise<boolean>;
    completeAppointment(appointmentId: string, consultationNotes?: string, prescription?: string): Promise<IAppointmentDocument | null>;
    cancelAppointment(appointmentId: string, cancelReason?: string): Promise<IAppointmentDocument | null>;
}
//# sourceMappingURL=appointment.repository.d.ts.map