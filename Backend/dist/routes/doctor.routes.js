import { Router } from "express";
import { container } from "../container/index.js";
import { TYPES } from "../container/types.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { ROUTES } from "../constants/routes.js";
import { doctorDocumentUpload, handleMulterError } from "../middleware/upload.middleware.js";
const router = Router();
const doctorController = container.get(TYPES.DoctorController);
router.post(ROUTES.DOCTOR.APPLY, authenticate, doctorDocumentUpload, handleMulterError, doctorController.apply);
router.get(ROUTES.DOCTOR.MY_STATUS, authenticate, doctorController.getMyStatus);
router.get(ROUTES.DOCTOR.MY_DASHBOARD, authenticate, doctorController.getMyDashboard);
export default router;
//# sourceMappingURL=doctor.routes.js.map