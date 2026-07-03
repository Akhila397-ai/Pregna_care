import { Router } from "express";
import { container } from "../container/index.js";
import {TYPES} from '../container/types.js'
import { IDoctorController } from "../controllers/doctor/interface/IDoctor.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { ROUTES } from "../constants/routes.js";
import { DoctorController } from "../controllers/doctor/implemetation/doctor.controller.js";
import { verifyResetJWT } from "../middleware/verifyResetJWT.middleware.js";


const router = Router();

const doctorController = container.get<IDoctorController>(
    TYPES.DoctorController
);

router.post(ROUTES.DOCTOR.APPLY,authenticate,doctorController.apply)
router.get(ROUTES.DOCTOR.MY_STATUS,authenticate,doctorController.getMyStatus)
router.get(ROUTES.DOCTOR.MY_DASHBOARD,authenticate, doctorController.getMyDashboard)


export default router;