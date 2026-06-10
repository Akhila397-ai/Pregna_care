export const validateRegister = (
    name: string,
    email: string,
    password: string
): string | null => {
    if(!name.trim()){
        return "Full name is required"
    }

    if(!email.trim()){
        return "Email required"
    }

    if(!/^[^\s@]+@[^\s@]+$]/.test(email)){
        return "Please enter a valid email address"
    }

    if(!password){
        return "Password is required"
    }

    if(password.length < 8){
        return "Password must be at least 8 characters"
    }
    return null
}
export const validateLogin = (
    email: string,
    password: string
): string | null => {
    if(!email.trim()){
        return "Email required"
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        return "Please enter valid email address"
    }

    if(!password){
        return "Password is required"
    }
    return null

}

export const validateOTP = (
    otp: string,
): string | null => {
    if(!otp){
        return "Please enter the otp"
    }
    if(otp.length < 6){
        return "Please enter the complete 6-digit otp"
    }
    return null
}
export const validateForgotPassword = (
    email: string,
): string | null => {
    if(!email.trim()){
        return "Email address required"
    }
     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        return "Please enter valid email address"
     }
     return null

}

export const validateResetPassword = (
    otp: string,
    password: string,
    confirmPassword: string
): string | null => {
    if(!otp || otp.length < 6){
        return "Please enter complete 6-digit OTP"
    }

    if(!password){
        return "Password required"
    }
    if(password.length < 8){
        return "Password must be atleast 8 characters"
    }
    if(password !== confirmPassword){
        return "Password do not match"
    }
    return null
}