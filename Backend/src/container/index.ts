import { UserRepository } from "../repositories/implementation/user.repository.js";
import { AuthService } from "../services/auth.service.js";

class Container {
    public userRepository: UserRepository;
    public authService: AuthService;

    constructor() {
       this.userRepository = new UserRepository();
       this.authService = new AuthService(this.userRepository);
    }
}

export const container = new Container();