import { Router } from "express";
import { container } from "../container/index.js";
import {TYPES} from '../container/types.js'
import { IDoctorController } from "../controllers/doctor/interface/IDoctor.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { ROUTES } from "../constants/routes.js";
import { DoctorController } from "../controllers/doctor/implemetation/doctor.controller.js";


const router = Router();

const doctorController = container.get<IDoctorController>(
    TYPES.DoctorController
);

router.post(ROUTES.DOCTOR.APPLY,doctorController.apply)
router.get(ROUTES.DOCTOR.MY_APPLICATION,authenticate,doctorController.getMyApplication)
router.get(ROUTES.DOCTOR.MY_PROFILE,doctorController.getMyProfile)


export default router;