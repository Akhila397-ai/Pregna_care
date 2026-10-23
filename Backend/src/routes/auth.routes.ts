import { Router } from "express";
import { container } from "../container/index.js";
import { TYPES } from "../container/types.js";
import { IAuthController } from "../controllers/auth/interface/IAuth.controller.js";
import { ROUTES } from "../constants/routes.js";
import { verifyResetJWT } from "../middleware/verifyResetJWT.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validateBody, validateParams } from "../middleware/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resendOtpSchema,
  onboardingSchema,
  pregnancyLmpSchema,
  cycleInfoSchema,
  emergencyContactSchema,
  emergencyContactParamSchema,
} from "../validators/auth.validator.js";

import { IDoctorController } from "../controllers/doctor/interface/IDoctor.controller.js";
import { requestPrimaryDoctorSchema } from "../validators/doctor.validator.js";

const router = Router();

const authController = container.get<IAuthController>(TYPES.AuthController);
const doctorController = container.get<IDoctorController>(TYPES.DoctorController);
router.get("/test", (req, res) => {
  res.json({ message: "Auth route working" });
});

router.route(ROUTES.AUTH.SIGNUP).post(validateBody(registerSchema), authController.register);
router.route(ROUTES.AUTH.VERIFY_OTP).post(validateBody(verifyOtpSchema), authController.verifyOtp);
router.route(ROUTES.AUTH.LOGIN).post(validateBody(loginSchema), authController.login);
router.route(ROUTES.AUTH.FORGOT_PASSWORD).post(validateBody(forgotPasswordSchema), authController.forgotPassword);
router.route(ROUTES.AUTH.RESET_PASSWORD).post(verifyResetJWT, validateBody(resetPasswordSchema), authController.resetPassword);
router.route(ROUTES.AUTH.RESEND_OTP).post(validateBody(resendOtpSchema), authController.resendOtp);
router.route(ROUTES.AUTH.REFRESH_TOKEN).post(authController.refreshToken)
router.route(ROUTES.AUTH.SET_ONBOARDING).post(authenticate, validateBody(onboardingSchema), authController.setOnboarding);
router.route(ROUTES.AUTH.ME).get(authenticate, authController.getMe);
router.route(ROUTES.AUTH.PREGNANCY_LMP).post(authenticate, validateBody(pregnancyLmpSchema), authController.setPregnancyLMP);
router.route(ROUTES.AUTH.PREGNANCY_DETAILS).get(authenticate, authController.getPregnancyDetails);
router.route(ROUTES.AUTH.CYCLE_SETUP).post(authenticate, validateBody(cycleInfoSchema), authController.setCycleInfo);
router.route(ROUTES.AUTH.CYCLE_DETAILS).get(authenticate, authController.getCycleDetails);
router.route(ROUTES.AUTH.EMERGENCY_CONTACTS)
  .get(authenticate, authController.getEmergencyContacts)
  .post(authenticate, validateBody(emergencyContactSchema), authController.addEmergencyContact);
router.route(ROUTES.AUTH.EMERGENCY_CONTACT_DETAIL)
  .put(authenticate, validateParams(emergencyContactParamSchema), validateBody(emergencyContactSchema), authController.updateEmergencyContact)
  .delete(authenticate, validateParams(emergencyContactParamSchema), authController.deleteEmergencyContact);
  router.route(ROUTES.AUTH.LOGOUT).post(authController.logout);

// ── Primary Doctor (Patient Side) ───────────
router.route(ROUTES.AUTH.PRIMARY_DOCTOR).get(authenticate, doctorController.getPatientPrimaryDoctor);
router.route(ROUTES.AUTH.REQUEST_PRIMARY_DOCTOR).post(authenticate, validateBody(requestPrimaryDoctorSchema), doctorController.requestPrimaryDoctor);
router.route(ROUTES.AUTH.CANCEL_PRIMARY_DOCTOR_REQUEST).post(authenticate, doctorController.cancelPrimaryDoctorRequest);
router.route(ROUTES.AUTH.REMOVE_PRIMARY_DOCTOR).post(authenticate, doctorController.removePrimaryDoctor);

export default router;