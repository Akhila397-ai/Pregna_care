import { Router } from "express";
import { container } from "../container/index.js";
import { Types } from "../container/types.js";
import { IAdminController } from "../controllers/admin/interface/IAdmin.controller.js";
import { isAdmin } from "../middleware/auth.middleware.js";
import { ROUTES } from "../constants/routes.js";

const router = Router();

const adminController = container.get<IAdminController>(Types.AdminController);



router.route(ROUTES.ADMIN.USERS).get(...isAdmin,adminController.getAllUsers);
router.route(ROUTES.ADMIN.BLOCK_USER).patch(...isAdmin,adminController.blockUser);
router.route(ROUTES.ADMIN.UNBLOCK_USER).patch(...isAdmin,adminController.unblockUser);
router.route(ROUTES.ADMIN.DELETE_USER).patch(...isAdmin,adminController.deleteUser);
router.route(ROUTES.ADMIN.DOCTORS).get(...isAdmin,adminController.getAllDoctors);
router.route(ROUTES.ADMIN.BLOCK_DOCTOR).patch(...isAdmin,adminController.blockDoctor);
router.route(ROUTES.ADMIN.UNBLOCK_DOCTOR).patch(...isAdmin,adminController.unblockDoctor);
router.route(ROUTES.ADMIN.DELETE_DOCTOR).patch(...isAdmin,adminController.deleteDoctor);
router.route(ROUTES.ADMIN.APPROVE_DOCTOR).patch(...isAdmin,adminController.approveDoctor);
router.route(ROUTES.ADMIN.REJECT_DOCTOR).patch(...isAdmin,adminController.rejectDoctor);


export default router;