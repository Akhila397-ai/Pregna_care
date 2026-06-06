import 'reflect-metadata'
import { Container } from 'inversify'
import { Types } from './types.js'

import { IUserRepository } from '../repositories/auth/interface/IUser.repository.js'
import { UserRepository } from '../repositories/auth/imlementation/user.repository.js'

import { IEmailService } from '../services/email/interface/IEmail.service.js'
import { EmailService } from '../services/email/implementation/email.service.js'

import { IAUthService } from '../services/auth/interface/IAuth.service.js'
import { AuthService } from '../services/auth/implementation/auth.service.js'

import { IAuthController } from '../controllers/auth/interface/IAuth.controller.js'
import { AuthController } from '../controllers/auth/implementation/auth.controller.js'

const container = new Container();

container.bind<IUserRepository>(Types.UserRepository).to(UserRepository);
container.bind<IEmailService>(Types.EmailService).to(EmailService);
container.bind<IAUthService>(Types.AuthService).to(AuthService);
container.bind<IAuthController>(Types.AuthController).to(AuthController)

export { container }