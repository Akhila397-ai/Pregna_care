import { Router } from "express";
import { container } from "../container/index.js";
import { Types } from "../container/types.js";
import { IAuthController } from "../controllers/auth/interface/IAuth.controller.js";
import { ROUTES } from "../constants/routes.js";

const router = Router();

const authController = container.get<IAuthController>(Types.AuthController);
router.get("/test", (req, res) => {
  res.json({ message: "Auth route working" });
});
router.post(ROUTES.AUTH.SIGNUP,authController.register);
router.post(ROUTES.AUTH.VERIFY_OTP, authController.verifyOtp)
router.post(ROUTES.AUTH.LOGIN, authController.login)
router.post(ROUTES.AUTH.FORGOT_PASSWORD,authController.forgotPassword)
router.post(ROUTES.AUTH.RESET_PASSWORD,authController.resetPassword)
router.post(ROUTES.AUTH.RESEND_OTP,authController.resendOtp)


export default router;