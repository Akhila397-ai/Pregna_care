import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";

const router = Router();


router.post("/signup",AuthController.signup);
router.post("/verify-otp", AuthController.verifyOtp);
router.post("/resend-otp",AuthController.resentOtp);
router.post("/login",AuthController.login)


export default router;