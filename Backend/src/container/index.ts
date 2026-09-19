import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types.js";

// Repositories
import { IUserRepository } from "../repositories/auth/interface/IUser.repository.js";
import { UserRepository } from "../repositories/auth/implementation/user.repository.js";
import { IOtpRepository } from "../repositories/otp/interface/IOtp.repository.js";
import { OtpRepository } from "../repositories/otp/implementation/otp.repository.js";
import { IAdminRepository } from "../repositories/admin/interface/IAdmin.repository.js";
import { AdminRepository } from "../repositories/admin/implementation/admin.repository.js";
import { IDoctorRepository } from "../repositories/doctor/interface/IDoctor.repository.js";
import { DoctorRepository } from "../repositories/doctor/implementation/doctor.repository.js";

// Services
import { IEmailService } from "../services/email/interface/IEmail.service.js";
import { EmailService } from "../services/email/implementation/email.service.js";
import { IAUthService } from "../services/auth/interface/IAuth.service.js";
import { AuthService } from "../services/auth/implementation/auth.service.js";
import { IAdminService } from "../services/admin/interface/IAdmin.service.js";
import { AdminService } from "../services/admin/implementation/admin.service.js";
import { IDoctorService } from "../services/doctor/interface/IDoctor.service.js";
import { DoctorService } from "../services/doctor/implementation/doctor.service.js";

// Controllers
import { IAuthController } from "../controllers/auth/interface/IAuth.controller.js";
import { AuthController } from "../controllers/auth/implementation/auth.controller.js";
import { IAdminController } from "../controllers/admin/interface/IAdmin.controller.js";
import { AdminController } from "../controllers/admin/implementation/admin.controller.js";
import { IDoctorController } from "../controllers/doctor/interface/IDoctor.controller.js";
import { DoctorController } from "../controllers/doctor/implementation/doctor.controller.js";

const container = new Container();

// Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IOtpRepository>(TYPES.OtpRepository).to(OtpRepository);
container.bind<IAdminRepository>(TYPES.AdminRepository).to(AdminRepository);
container.bind<IDoctorRepository>(TYPES.DoctorRepository).to(DoctorRepository);

// Services
container.bind<IEmailService>(TYPES.EmailService).to(EmailService);
container.bind<IAUthService>(TYPES.AuthService).to(AuthService);
container.bind<IAdminService>(TYPES.AdminService).to(AdminService);
container.bind<IDoctorService>(TYPES.DoctorService).to(DoctorService);

// Controllers
container.bind<IAuthController>(TYPES.AuthController).to(AuthController);
container.bind<IAdminController>(TYPES.AdminController).to(AdminController);
container.bind<IDoctorController>(TYPES.DoctorController).to(DoctorController);

export { container };