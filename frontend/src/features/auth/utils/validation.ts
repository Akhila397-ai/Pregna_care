export interface RegisterErrors {
    name?: string;
    email?: string;
    password?: string;
}

export interface LoginErrors {
    email?: string;
    password?: string
}

export interface OTPErrors {
    otp?: string;
}

export interface ForgotPasswordErrors {
    email?: string;
}

export interface ResetPasswordErrors {
    otp?: string;
    password?: string;
    confirmPassword?: string;
}



export const validateRegister = (
    name: string,
    email: string,
    password: string
): RegisterErrors => {
    const errors: RegisterErrors = {}
    if(!name.trim()){
      errors.name =  "Full name is required"
    }

    if(!email.trim()){
        errors.email =  "Email required";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address";
}

    if(!password){
        errors.password = "Password is required"
    }

    if(password.length < 8){
        errors.password = "Password must be at least 8 characters"
    }
    return errors;
}
export const validateLogin = (
    email: string,
    password: string
): LoginErrors => {
    const errors: LoginErrors = {};
    if(!email.trim()){
        errors.email = "Email required"
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        errors.password =  "Please enter valid email address"
    }

    if(!password){
        errors.password = "Password is required"
    }
    return errors;

}

export const validateOTP = (
    otp: string,
): OTPErrors => {
    const errors: OTPErrors = {}
    if(!otp){
        errors.otp =  "Please enter the otp"
    }
    if(otp.length < 6){
        errors.otp =  "Please enter the complete 6-digit otp"
    }
    return errors;
}
export const validateForgotPassword = (
    email: string,
): ForgotPasswordErrors => {
    const errors: ForgotPasswordErrors = {}
    if(!email.trim()){
        errors.email =  "Email address required"
    }
     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        errors.email = "Please enter valid email address"
     }
     return errors;

}

export const validateResetPassword = (
    password: string,
    confirmPassword: string
): ResetPasswordErrors => {
    const errors: ResetPasswordErrors = {}

    if(!password){
        errors.password =  "Password required"
    }
    if(password.length < 8){
        errors.password = "Password must be atleast 8 characters"
    }

    if(!password || !confirmPassword){
        errors.password = "Please fill all the fields"
    }
    if(password !== confirmPassword){
        errors.confirmPassword =  "Password do not match"
    }
    return errors;
}

export const hasErrors = (errors: object): boolean => {
    return Object.keys(errors).length> 0
}