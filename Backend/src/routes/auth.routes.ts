import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/authMiddleaware.js";

const router = Router();

router.post('/signup',AuthController.signup);
router.post('/verify-otp',AuthController.verifyOtp)
router.post('/resend-otp',AuthController.resendOtp)
// router.post("/google-auth", AuthController.googleAuth);
router.post("/login",AuthController.login);
router.get("/pathselection",authMiddleware,(req,res)=>{
    res.json({message:"protected route working"})
})
export default router;