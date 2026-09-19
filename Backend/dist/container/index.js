import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types.js";
import { UserRepository } from "../repositories/auth/implementation/user.repository.js";
import { OtpRepository } from "../repositories/otp/implementation/otp.repository.js";
import { AdminRepository } from "../repositories/admin/implementation/admin.repository.js";
import { DoctorRepository } from "../repositories/doctor/implementation/doctor.repository.js";
import { EmailService } from "../services/email/implementation/email.service.js";
import { AuthService } from "../services/auth/implementation/auth.service.js";
import { AdminService } from "../services/admin/implementation/admin.service.js";
import { DoctorService } from "../services/doctor/implementation/doctor.service.js";
import { AuthController } from "../controllers/auth/implementation/auth.controller.js";
import { AdminController } from "../controllers/admin/implementation/admin.controller.js";
import { DoctorController } from "../controllers/doctor/implementation/doctor.controller.js";
const container = new Container();
// Repositories
container.bind(TYPES.UserRepository).to(UserRepository);
container.bind(TYPES.OtpRepository).to(OtpRepository);
container.bind(TYPES.AdminRepository).to(AdminRepository);
container.bind(TYPES.DoctorRepository).to(DoctorRepository);
// Services
container.bind(TYPES.EmailService).to(EmailService);
container.bind(TYPES.AuthService).to(AuthService);
container.bind(TYPES.AdminService).to(AdminService);
container.bind(TYPES.DoctorService).to(DoctorService);
// Controllers
container.bind(TYPES.AuthController).to(AuthController);
container.bind(TYPES.AdminController).to(AdminController);
container.bind(TYPES.DoctorController).to(DoctorController);
export { container };
//# sourceMappingURL=index.js.map