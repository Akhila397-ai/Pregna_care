export interface SignupPayload {
    name: string,
    email: string,
    password: string
}

export interface Verifypayload {
    email: string,
    otp: string
}