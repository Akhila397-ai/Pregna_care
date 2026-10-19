import { Router } from "express";
import { container } from "../container/index.js";
import { TYPES } from "../container/types.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { ROUTES } from "../constants/routes.js";
import { doctorDocumentUpload, handleMulterError } from "../middleware/upload.middleware.js";
import { bookAppointmentSchema, completeAppointmentSchema, cancelAppointmentSchema, respondPrimaryDoctorRequestSchema, submitDoctorReportSchema, } from "../validators/doctor.validator.js";
const router = Router();
const doctorController = container.get(TYPES.DoctorController);
router.post(ROUTES.DOCTOR.APPLY, authenticate, doctorDocumentUpload, handleMulterError, doctorController.apply);
router.get(ROUTES.DOCTOR.MY_STATUS, authenticate, doctorController.getMyStatus);
router.get(ROUTES.DOCTOR.MY_DASHBOARD, authenticate, doctorController.getMyDashboard);
router.get(ROUTES.DOCTOR.VERIFIED_DOCTORS, authenticate, doctorController.getVerifiedDoctors);
// ── Appointments ───────────────────────────
router.post(ROUTES.DOCTOR.BOOK_APPOINTMENT, authenticate, validateBody(bookAppointmentSchema), doctorController.bookAppointment);
router.get(ROUTES.DOCTOR.PATIENT_APPOINTMENTS, authenticate, doctorController.getPatientAppointments);
router.get(ROUTES.DOCTOR.DOCTOR_APPOINTMENTS, authenticate, doctorController.getDoctorAppointments);
router.patch(ROUTES.DOCTOR.COMPLETE_APPOINTMENT, authenticate, validateBody(completeAppointmentSchema), doctorController.completeAppointment);
router.patch(ROUTES.DOCTOR.CANCEL_APPOINTMENT, authenticate, validateBody(cancelAppointmentSchema), doctorController.cancelAppointment);
// ── Primary Doctor Requests (Doctor Side) ──
router.get(ROUTES.DOCTOR.PRIMARY_REQUESTS, authenticate, doctorController.getDoctorPrimaryRequests);
router.post(ROUTES.DOCTOR.RESPOND_PRIMARY_REQUEST, authenticate, validateBody(respondPrimaryDoctorRequestSchema), doctorController.respondToPrimaryRequest);
// ── Reporting ──────────────────────────────
router.post(ROUTES.DOCTOR.SUBMIT_REPORT, authenticate, validateBody(submitDoctorReportSchema), doctorController.submitDoctorReport);
export default router;
//# sourceMappingURL=doctor.routes.js.map