import { Router } from "express";
import { container } from "../container/index.js";
import { TYPES } from "../container/types.js";
import { IAuthController } from "../controllers/auth/interface/IAuth.controller.js";
import { ROUTES } from "../constants/routes.js";
import { auth } from "google-auth-library";
import { verifyResetJWT } from "../middleware/verifyResetJWT.middleware.js";

const router = Router();

const authController = container.get<IAuthController>(TYPES.AuthController);
router.get("/test", (req, res) => {
  res.json({ message: "Auth route working" });
});

router.route(ROUTES.AUTH.SIGNUP).post(authController.register)
router.route(ROUTES.AUTH.VERIFY_OTP).post(authController.verifyOtp)
router.route(ROUTES.AUTH.LOGIN).post(authController.login)
router.route(ROUTES.AUTH.FORGOT_PASSWORD).post(authController.forgotPassword);
router.route(ROUTES.AUTH.RESET_PASSWORD).post(verifyResetJWT,authController.resetPassword)
router.route(ROUTES.AUTH.RESEND_OTP).post(authController.resendOtp)


export default router;