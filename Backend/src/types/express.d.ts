import { UserRole } from "./roles.ts";
import { JWTPayload } from "./roles.ts";

declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload
        }
    }
}

export {};