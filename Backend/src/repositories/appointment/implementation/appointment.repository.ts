import { injectable } from "inversify";
import { Types } from "mongoose";
import AppointmentModel, { IAppointmentDocument } from "../../../models/appointment.model.js";
import { CreateAppointmentData, IAppointmentRepository } from "../interface/IAppointment.repository.js";

@injectable()
export class AppointmentRepository implements IAppointmentRepository {
  async createAppointment(data: CreateAppointmentData): Promise<IAppointmentDocument> {
    const doc = await AppointmentModel.create({
      patientId: new Types.ObjectId(data.patientId),
      doctorId: new Types.ObjectId(data.doctorId),
      doctorApplicationId: new Types.ObjectId(data.doctorApplicationId),
      appointmentDate: data.appointmentDate,
      timeSlot: data.timeSlot.trim(),
      reason: data.reason?.trim(),
      status: 'scheduled',
    });
    return doc;
  }

  async findPatientAppointments(patientId: string): Promise<IAppointmentDocument[]> {
    const pId = Types.ObjectId.isValid(patientId) ? new Types.ObjectId(patientId) : patientId;
    return await AppointmentModel.find({ patientId: pId })
      .populate('doctorId', 'name email phone imageUrl')
      .populate('doctorApplicationId', 'fullName specialization clinicName clinicAddress profileImage consultationFee')
      .sort({ appointmentDate: -1, createdAt: -1 });
  }

  async findDoctorAppointments(doctorId: string): Promise<IAppointmentDocument[]> {
    const dId = Types.ObjectId.isValid(doctorId) ? new Types.ObjectId(doctorId) : doctorId;
    return await AppointmentModel.find({ doctorId: dId })
      .populate('patientId', 'name email phone fullName lmpDate onboardingType')
      .sort({ appointmentDate: -1, createdAt: -1 });
  }

  async findAppointmentById(appointmentId: string): Promise<IAppointmentDocument | null> {
    const aId = Types.ObjectId.isValid(appointmentId) ? new Types.ObjectId(appointmentId) : appointmentId;
    return await AppointmentModel.findById(aId)
      .populate('patientId', 'name email phone fullName lmpDate onboardingType')
      .populate('doctorId', 'name email phone imageUrl')
      .populate('doctorApplicationId', 'fullName specialization clinicName clinicAddress profileImage consultationFee');
  }

  async isSlotBooked(doctorId: string, appointmentDate: Date, timeSlot: string): Promise<boolean> {
    const dId = Types.ObjectId.isValid(doctorId) ? new Types.ObjectId(doctorId) : doctorId;
    const startOfDay = new Date(appointmentDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(appointmentDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const count = await AppointmentModel.countDocuments({
      doctorId: dId,
      timeSlot: timeSlot.trim(),
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      status: 'scheduled',
    });
    return count > 0;
  }

  async completeAppointment(
    appointmentId: string,
    consultationNotes?: string,
    prescription?: string
  ): Promise<IAppointmentDocument | null> {
    const aId = Types.ObjectId.isValid(appointmentId) ? new Types.ObjectId(appointmentId) : appointmentId;
    return await AppointmentModel.findByIdAndUpdate(
      aId,
      {
        $set: {
          status: 'completed',
          consultationNotes: consultationNotes?.trim(),
          prescription: prescription?.trim(),
          completedAt: new Date(),
        },
      },
      { new: true }
    )
      .populate('patientId', 'name email phone fullName lmpDate onboardingType')
      .populate('doctorId', 'name email phone imageUrl')
      .populate('doctorApplicationId', 'fullName specialization clinicName clinicAddress profileImage consultationFee');
  }

  async cancelAppointment(appointmentId: string, cancelReason?: string): Promise<IAppointmentDocument | null> {
    const aId = Types.ObjectId.isValid(appointmentId) ? new Types.ObjectId(appointmentId) : appointmentId;
    return await AppointmentModel.findByIdAndUpdate(
      aId,
      {
        $set: {
          status: 'cancelled',
          cancelReason: cancelReason?.trim(),
          cancelledAt: new Date(),
        },
      },
      { new: true }
    );
  }
}
