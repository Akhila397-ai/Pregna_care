var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from "inversify";
import { Types } from "mongoose";
import DoctorReportModel from "../../../models/doctorReport.model.js";
let DoctorReportRepository = class DoctorReportRepository {
    async createReport(data) {
        const doc = await DoctorReportModel.create({
            patientId: new Types.ObjectId(data.patientId),
            doctorId: new Types.ObjectId(data.doctorId),
            appointmentId: data.appointmentId ? new Types.ObjectId(data.appointmentId) : undefined,
            reason: data.reason,
            description: data.description.trim(),
            status: 'submitted',
        });
        return doc;
    }
    async findAllReports(status) {
        const filter = {};
        if (status) {
            filter.status = status;
        }
        return await DoctorReportModel.find(filter)
            .populate('patientId', 'name email phone fullName')
            .populate('doctorId', 'name email phone')
            .populate('appointmentId', 'appointmentDate timeSlot status')
            .sort({ createdAt: -1 });
    }
    async findReportById(reportId) {
        const rId = Types.ObjectId.isValid(reportId) ? new Types.ObjectId(reportId) : reportId;
        return await DoctorReportModel.findById(rId)
            .populate('patientId', 'name email phone fullName')
            .populate('doctorId', 'name email phone')
            .populate('appointmentId', 'appointmentDate timeSlot status');
    }
    async findReportsByPatientId(patientId) {
        const pId = Types.ObjectId.isValid(patientId) ? new Types.ObjectId(patientId) : patientId;
        return await DoctorReportModel.find({ patientId: pId })
            .populate('doctorId', 'name email phone')
            .sort({ createdAt: -1 });
    }
    async resolveReport(reportId, adminRemarks, adminUserId) {
        const rId = Types.ObjectId.isValid(reportId) ? new Types.ObjectId(reportId) : reportId;
        return await DoctorReportModel.findByIdAndUpdate(rId, {
            $set: {
                status: 'resolved',
                adminRemarks: adminRemarks.trim(),
                resolvedAt: new Date(),
                resolvedBy: new Types.ObjectId(adminUserId),
            },
        }, { new: true })
            .populate('patientId', 'name email phone fullName')
            .populate('doctorId', 'name email phone');
    }
};
DoctorReportRepository = __decorate([
    injectable()
], DoctorReportRepository);
export { DoctorReportRepository };
//# sourceMappingURL=doctorReport.repository.js.map