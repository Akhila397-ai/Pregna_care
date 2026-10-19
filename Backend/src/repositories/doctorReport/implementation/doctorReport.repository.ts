import { injectable } from "inversify";
import { Types } from "mongoose";
import DoctorReportModel, { IDoctorReportDocument } from "../../../models/doctorReport.model.js";
import { CreateDoctorReportData, IDoctorReportRepository } from "../interface/IDoctorReport.repository.js";

@injectable()
export class DoctorReportRepository implements IDoctorReportRepository {
  async createReport(data: CreateDoctorReportData): Promise<IDoctorReportDocument> {
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

  async findAllReports(status?: string): Promise<IDoctorReportDocument[]> {
    const filter: any = {};
    if (status) {
      filter.status = status;
    }
    return await DoctorReportModel.find(filter)
      .populate('patientId', 'name email phone fullName')
      .populate('doctorId', 'name email phone')
      .populate('appointmentId', 'appointmentDate timeSlot status')
      .sort({ createdAt: -1 });
  }

  async findReportById(reportId: string): Promise<IDoctorReportDocument | null> {
    const rId = Types.ObjectId.isValid(reportId) ? new Types.ObjectId(reportId) : reportId;
    return await DoctorReportModel.findById(rId)
      .populate('patientId', 'name email phone fullName')
      .populate('doctorId', 'name email phone')
      .populate('appointmentId', 'appointmentDate timeSlot status');
  }

  async findReportsByPatientId(patientId: string): Promise<IDoctorReportDocument[]> {
    const pId = Types.ObjectId.isValid(patientId) ? new Types.ObjectId(patientId) : patientId;
    return await DoctorReportModel.find({ patientId: pId })
      .populate('doctorId', 'name email phone')
      .sort({ createdAt: -1 });
  }

  async resolveReport(
    reportId: string,
    adminRemarks: string,
    adminUserId: string
  ): Promise<IDoctorReportDocument | null> {
    const rId = Types.ObjectId.isValid(reportId) ? new Types.ObjectId(reportId) : reportId;
    return await DoctorReportModel.findByIdAndUpdate(
      rId,
      {
        $set: {
          status: 'resolved',
          adminRemarks: adminRemarks.trim(),
          resolvedAt: new Date(),
          resolvedBy: new Types.ObjectId(adminUserId),
        },
      },
      { new: true }
    )
      .populate('patientId', 'name email phone fullName')
      .populate('doctorId', 'name email phone');
  }
}
