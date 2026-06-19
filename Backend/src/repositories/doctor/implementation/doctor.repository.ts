import { injectable } from "inversify";
import { Types } from "mongoose";
import { IDoctorRepository } from "../interface/iDoctor.repository.js";
import { doctorApplicationData,doctorProfileData } from "../../../types/doctor.js";
import doctorApplicationModel from "../../../models/doctorApplication.model.js";
