import { AdminController } from "../controllers/admin/implementation/admin.controller.js";
import { AuthController } from "../controllers/auth/implementation/auth.controller.js";
import { AdminRepository } from "../repositories/admin/implementation/admin.repository.js";
import { UserRepository } from "../repositories/auth/imlementation/user.repository.js";
import { AuthService } from "../services/auth/implementation/auth.service.js";
import { EmailService } from "../services/email/implementation/email.service.js";


export const Types = {
    UserRepository: Symbol.for('UserRepository'),
    EmailService: Symbol.for('EmailService'),
    AuthService: Symbol.for('AuthService'),
    AuthController: Symbol.for('AuthController'),
    
    //Admin
    AdminRepository: Symbol.for('AdminRepository'),
    AdminService: Symbol.for('AdminService'),
    AdminController: Symbol.for('AdminController')
    

    
    
}