import { ApplyDoctorPayload } from "../types/doctor.types";
import { api } from "./api";

export const applyDoctor = async (data: ApplyDoctorPayload) => {
    const res = await api.post("/doctor/apply",data)
    return res.data
}