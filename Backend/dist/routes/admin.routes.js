import { Router } from "express";
import { container } from "../container/index.js";
import { TYPES } from "../container/types.js";
import { isAdmin } from "../middleware/auth.middleware.js";
import { ROUTES } from "../constants/routes.js";
import { validateBody, validateParams, validateQuery } from "../middleware/validate.middleware.js";
import { userIdParamSchema, doctorIdParamSchema, getDoctorDocumentParamSchema, paginationQuerySchema, rejectDoctorSchema, } from "../validators/admin.validator.js";
import { resolveDoctorReportSchema } from "../validators/doctor.validator.js";
const router = Router();
const adminController = container.get(TYPES.AdminController);
const doctorController = container.get(TYPES.DoctorController);
router.route(ROUTES.ADMIN.USERS).get(...isAdmin, validateQuery(paginationQuerySchema), adminController.getAllUsers);
router.route(ROUTES.ADMIN.BLOCK_USER).patch(...isAdmin, validateParams(userIdParamSchema), adminController.blockUser);
router.route(ROUTES.ADMIN.UNBLOCK_USER).patch(...isAdmin, validateParams(userIdParamSchema), adminController.unblockUser);
router.route(ROUTES.ADMIN.DELETE_USER).patch(...isAdmin, validateParams(userIdParamSchema), adminController.deleteUser);
router.route(ROUTES.ADMIN.DOCTORS).get(...isAdmin, validateQuery(paginationQuerySchema), adminController.getAllDoctors);
router.get(ROUTES.ADMIN.GETDOCTORDOCUMENT, ...isAdmin, validateParams(getDoctorDocumentParamSchema), adminController.getDoctorDocumentUrl);
router.route(ROUTES.ADMIN.VERIFY_DOCTOR).patch(...isAdmin, validateParams(doctorIdParamSchema), adminController.verifyDoctor);
router.route(ROUTES.ADMIN.BLOCK_DOCTOR).patch(...isAdmin, validateParams(doctorIdParamSchema), adminController.blockDoctor);
router.route(ROUTES.ADMIN.UNBLOCK_DOCTOR).patch(...isAdmin, validateParams(doctorIdParamSchema), adminController.unblockDoctor);
router.route(ROUTES.ADMIN.DELETE_DOCTOR).patch(...isAdmin, validateParams(doctorIdParamSchema), adminController.deleteDoctor);
router.route(ROUTES.ADMIN.APPROVE_DOCTOR).patch(...isAdmin, validateParams(doctorIdParamSchema), adminController.approveDoctor);
router.route(ROUTES.ADMIN.REJECT_DOCTOR).patch(...isAdmin, validateParams(doctorIdParamSchema), validateBody(rejectDoctorSchema), adminController.rejectDoctor);
// ── Doctor Reports Management ──────────────
router.route(ROUTES.ADMIN.DOCTOR_REPORTS).get(...isAdmin, doctorController.getDoctorReports);
router.route(ROUTES.ADMIN.RESOLVE_DOCTOR_REPORT).patch(...isAdmin, validateBody(resolveDoctorReportSchema), doctorController.resolveDoctorReport);
export default router;
//# sourceMappingURL=admin.routes.js.map