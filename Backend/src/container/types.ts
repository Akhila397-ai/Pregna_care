export const TYPES = {
  // Repositories
  UserRepository: Symbol.for("UserRepository"),
  OtpRepository: Symbol.for("OtpRepository"),
  AdminRepository: Symbol.for("AdminRepository"),
  DoctorRepository: Symbol.for("DoctorRepository"),

  // Services
  AuthService: Symbol.for("AuthService"),
  AdminService: Symbol.for("AdminService"),
  DoctorService: Symbol.for("DoctorService"),
  EmailService: Symbol.for("EmailService"),

  // Controllers
  AuthController: Symbol.for("AuthController"),
  AdminController: Symbol.for("AdminController"),
  DoctorController: Symbol.for("DoctorController"),
};