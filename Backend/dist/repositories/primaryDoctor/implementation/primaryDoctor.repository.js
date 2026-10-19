var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from "inversify";
import { Types } from "mongoose";
import PrimaryDoctorRelationshipModel from "../../../models/primaryDoctorRelationship.model.js";
import UserModel from "../../../models/User.model.js";
let PrimaryDoctorRepository = class PrimaryDoctorRepository {
    async createRequest(patientId, doctorId, doctorApplicationId) {
        const pId = new Types.ObjectId(patientId);
        const dId = new Types.ObjectId(doctorId);
        const docAppId = new Types.ObjectId(doctorApplicationId);
        const doc = await PrimaryDoctorRelationshipModel.create({
            patientId: pId,
            doctorId: dId,
            doctorApplicationId: docAppId,
            status: 'pending',
            requestedAt: new Date(),
            history: [
                {
                    event: 'PRIMARY_REQUESTED',
                    timestamp: new Date(),
                    note: 'Primary doctor relationship requested by patient.',
                },
            ],
        });
        return doc;
    }
    async findActiveRelationship(patientId) {
        const pId = Types.ObjectId.isValid(patientId) ? new Types.ObjectId(patientId) : patientId;
        return await PrimaryDoctorRelationshipModel.findOne({
            patientId: pId,
            status: 'active',
        })
            .populate('doctorId', 'name email phone imageUrl')
            .populate('doctorApplicationId', 'fullName specialization qualification experience clinicName clinicAddress profileImage consultationFee availability');
    }
    async findPendingRelationship(patientId) {
        const pId = Types.ObjectId.isValid(patientId) ? new Types.ObjectId(patientId) : patientId;
        return await PrimaryDoctorRelationshipModel.findOne({
            patientId: pId,
            status: 'pending',
        })
            .populate('doctorId', 'name email phone imageUrl')
            .populate('doctorApplicationId', 'fullName specialization qualification experience clinicName clinicAddress profileImage consultationFee availability');
    }
    async findRelationshipById(relationshipId) {
        const rId = Types.ObjectId.isValid(relationshipId) ? new Types.ObjectId(relationshipId) : relationshipId;
        return await PrimaryDoctorRelationshipModel.findById(rId)
            .populate('patientId', 'name email phone fullName lmpDate onboardingType')
            .populate('doctorId', 'name email phone imageUrl')
            .populate('doctorApplicationId', 'fullName specialization qualification experience clinicName clinicAddress profileImage consultationFee availability');
    }
    async findRequestsForDoctor(doctorId, status = 'pending') {
        const dId = Types.ObjectId.isValid(doctorId) ? new Types.ObjectId(doctorId) : doctorId;
        const filter = { doctorId: dId };
        if (status) {
            filter.status = status;
        }
        return await PrimaryDoctorRelationshipModel.find(filter)
            .populate('patientId', 'name email phone fullName lmpDate onboardingType')
            .sort({ requestedAt: -1, createdAt: -1 });
    }
    async findPatientRelationshipHistory(patientId) {
        const pId = Types.ObjectId.isValid(patientId) ? new Types.ObjectId(patientId) : patientId;
        return await PrimaryDoctorRelationshipModel.find({ patientId: pId })
            .populate('doctorId', 'name email phone imageUrl')
            .populate('doctorApplicationId', 'fullName specialization clinicName')
            .sort({ createdAt: -1 });
    }
    async updateStatus(relationshipId, status, event, note, rejectionReason) {
        const rId = Types.ObjectId.isValid(relationshipId) ? new Types.ObjectId(relationshipId) : relationshipId;
        const updatePayload = {
            status,
            $push: {
                history: {
                    event,
                    timestamp: new Date(),
                    note: note || `Status updated to ${status}`,
                },
            },
        };
        if (status === 'active' || status === 'declined') {
            updatePayload.respondedAt = new Date();
        }
        if (status === 'ended' || status === 'cancelled') {
            updatePayload.endedAt = new Date();
        }
        if (rejectionReason) {
            updatePayload.rejectionReason = rejectionReason;
        }
        const updated = await PrimaryDoctorRelationshipModel.findByIdAndUpdate(rId, updatePayload, { new: true })
            .populate('patientId', 'name email phone fullName lmpDate onboardingType')
            .populate('doctorId', 'name email phone imageUrl')
            .populate('doctorApplicationId', 'fullName specialization qualification experience clinicName clinicAddress profileImage consultationFee availability');
        // Update patient user's primaryDoctorId accordingly
        if (updated) {
            if (status === 'active') {
                await UserModel.findByIdAndUpdate(updated.patientId, {
                    $set: { primaryDoctorId: updated.doctorId },
                });
            }
            else if (status === 'ended' || status === 'cancelled') {
                await UserModel.findByIdAndUpdate(updated.patientId, {
                    $set: { primaryDoctorId: null },
                });
            }
        }
        return updated;
    }
    async endActiveRelationshipsForPatient(patientId, newDoctorName) {
        const pId = Types.ObjectId.isValid(patientId) ? new Types.ObjectId(patientId) : patientId;
        const now = new Date();
        await PrimaryDoctorRelationshipModel.updateMany({
            patientId: pId,
            status: 'active',
        }, {
            $set: {
                status: 'ended',
                endedAt: now,
            },
            $push: {
                history: {
                    event: 'PRIMARY_CHANGED',
                    timestamp: now,
                    note: newDoctorName
                        ? `Primary doctor changed to ${newDoctorName}.`
                        : 'Primary doctor relationship ended.',
                },
            },
        });
    }
};
PrimaryDoctorRepository = __decorate([
    injectable()
], PrimaryDoctorRepository);
export { PrimaryDoctorRepository };
//# sourceMappingURL=primaryDoctor.repository.js.map