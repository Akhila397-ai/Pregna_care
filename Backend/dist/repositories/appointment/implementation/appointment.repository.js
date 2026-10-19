var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from "inversify";
import { Types } from "mongoose";
import AppointmentModel from "../../../models/appointment.model.js";
let AppointmentRepository = class AppointmentRepository {
    async createAppointment(data) {
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
    async findPatientAppointments(patientId) {
        const pId = Types.ObjectId.isValid(patientId) ? new Types.ObjectId(patientId) : patientId;
        return await AppointmentModel.find({ patientId: pId })
            .populate('doctorId', 'name email phone imageUrl')
            .populate('doctorApplicationId', 'fullName specialization clinicName clinicAddress profileImage consultationFee')
            .sort({ appointmentDate: -1, createdAt: -1 });
    }
    async findDoctorAppointments(doctorId) {
        const dId = Types.ObjectId.isValid(doctorId) ? new Types.ObjectId(doctorId) : doctorId;
        return await AppointmentModel.find({ doctorId: dId })
            .populate('patientId', 'name email phone fullName lmpDate onboardingType')
            .sort({ appointmentDate: -1, createdAt: -1 });
    }
    async findAppointmentById(appointmentId) {
        const aId = Types.ObjectId.isValid(appointmentId) ? new Types.ObjectId(appointmentId) : appointmentId;
        return await AppointmentModel.findById(aId)
            .populate('patientId', 'name email phone fullName lmpDate onboardingType')
            .populate('doctorId', 'name email phone imageUrl')
            .populate('doctorApplicationId', 'fullName specialization clinicName clinicAddress profileImage consultationFee');
    }
    async isSlotBooked(doctorId, appointmentDate, timeSlot) {
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
    async completeAppointment(appointmentId, consultationNotes, prescription) {
        const aId = Types.ObjectId.isValid(appointmentId) ? new Types.ObjectId(appointmentId) : appointmentId;
        return await AppointmentModel.findByIdAndUpdate(aId, {
            $set: {
                status: 'completed',
                consultationNotes: consultationNotes?.trim(),
                prescription: prescription?.trim(),
                completedAt: new Date(),
            },
        }, { new: true })
            .populate('patientId', 'name email phone fullName lmpDate onboardingType')
            .populate('doctorId', 'name email phone imageUrl')
            .populate('doctorApplicationId', 'fullName specialization clinicName clinicAddress profileImage consultationFee');
    }
    async cancelAppointment(appointmentId, cancelReason) {
        const aId = Types.ObjectId.isValid(appointmentId) ? new Types.ObjectId(appointmentId) : appointmentId;
        return await AppointmentModel.findByIdAndUpdate(aId, {
            $set: {
                status: 'cancelled',
                cancelReason: cancelReason?.trim(),
                cancelledAt: new Date(),
            },
        }, { new: true });
    }
};
AppointmentRepository = __decorate([
    injectable()
], AppointmentRepository);
export { AppointmentRepository };
//# sourceMappingURL=appointment.repository.js.map