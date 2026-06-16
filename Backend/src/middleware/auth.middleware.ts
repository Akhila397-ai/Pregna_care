import { Request,Response,NextFunction } from "express";
import { verifyAccessToken } from "../utils/generateToken.js";
import { HttpResponse } from "../constants/messages.constant.js";
import { HttpStatus } from "../constants/status.constant.js";
import { UserRole } from "../types/roles.js";




const extractToken = (req: Request): string | null => {
    return(
        req.cookies?.accessToken ||
        req.headers.authorization?.split(' ')[1] ||
        null
    )
}


export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log('AUTH START');

  try {
    const token = extractToken(req);

    console.log('TOKEN:', token);

    if (!token) {
      console.log('NO TOKEN');
      res.status(401).json({ error: 'Unauthorized access' });
      return;
    }

    const decoded = verifyAccessToken(token);

    console.log('DECODED:', decoded);

    req.user = decoded;

    console.log('BEFORE NEXT');
    next();
    console.log('AFTER NEXT');
  } catch (error) {
    console.log('AUTH ERROR:', error);

    res.status(401).json({ error: 'Unauthorized access' });
  }
};

export const authorizeRoles = (...roles: UserRole[]) => {
    
    return(
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {
             console.log('AUTHORIZE HIT');
        if(!req.user){
            res.status(HttpStatus.UNAUTHORIZED).json({error: HttpResponse.UNAUTHORIZED})
            return
        }
        console.log('Required Roles:', roles);
console.log('User:', req.user);
console.log('User Role:', req.user?.role);

       if (!req.user?.role) {
  res.status(HttpStatus.UNAUTHORIZED).json({
    error: HttpResponse.UNAUTHORIZED,
  });
  return;
}

if (!roles.includes(req.user.role)) {
  res.status(HttpStatus.FORBIDDEN).json({
    error: HttpResponse.FORBIDDEN,
  });
  return;
}
        next()
    }
}


export const isUser = [
    authenticate,
    authorizeRoles('user')
]

export const isAdmin = [
    authenticate,
    authorizeRoles('admin')
]
export const isDoctor = [
    authenticate,
    authorizeRoles('doctor')
]

export const isAdminOrDoctor = [
    authenticate,
    authorizeRoles('admin','doctor')
]

export const isAnyRole = [
    authenticate,
    authorizeRoles('user','admin','doctor')
]